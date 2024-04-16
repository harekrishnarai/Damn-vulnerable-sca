# Malicious Packages - Code & Binary

## Background

This projects demonstrates a prominent attack vector beyond vulnerabilities - Malicious Packages.

Malicious packages differentiate from vulnerabilities in the sense that vulnerabilities are usually an innocent mistake done by a developer, while malicious packages are malicious by nature and will run by definition. 

So you will see, that in this case, we don't really need to execute anything, the malicious code will run just by including the package.
This is why, this service doesn't do anything, and you are not required to execute any endpoint call.


Those malicious attacks are generally divided to:
- "Visible Malicious Code" - Malicious code that is visible in the source code, with attacks as:
  - Typosquatting (r77 rootkit)
  - Dependency Confusion (Pytorch)
- "Hidden Malicious Code" - Malicious code hidden in a binary/compiled dependency, with attacks as:
  - CI/CD Attacks (Solarwinds, 3CX)
  - ATO (UA-Parser)
  - Distribution Server Attacks (JumpCloud)
  - Malicious Maintainer (XZ-Utils)

## What does the malicious code do?
The "malicious" code will extract an environment variable and send it to a remote server.
This is just for example purposes, and so we didn't include any actual malicious code that might compromise your machine or envionrment, you can feel safe to execute it.

## Prerequisites

1. Install Java 17 and Maven

## Run the application

1. Build the Spring Boot app with `mvn clean package`
2. Start it with `java -jar target/hello-0.0.1-SNAPSHOT.jar`


## Verify the malicious code in the repo result


## Verify the malicious code in the binary result

## References

- [XZ-Utils](https://research.swtch.com/xz-timeline)
- [3CX](https://cloud.google.com/blog/topics/threat-intelligence/3cx-software-supply-chain-compromise)
- [Solarwinds](https://www.techtarget.com/whatis/feature/SolarWinds-hack-explained-Everything-you-need-to-know)
- [UA-Parser](https://portswigger.net/daily-swig/popular-npm-package-ua-parser-js-poisoned-with-cryptomining-password-stealing-malware)
- [JumpCloud](https://cloud.google.com/blog/topics/threat-intelligence/north-korea-supply-chain)
- [Typosquatting](https://www.reversinglabs.com/blog/r77-rootkit-typosquatting-npm-threat-research)
- [Dependency Confusion](https://www.aquasec.com/blog/pytorch-dependency-confusion-administered-malware/)