<p align="center">
    <img src="/static/images/logo.png" alt="SCA Goat">
     <br>SCA Goat<br> Navigating SCA Vulnerabilities, Empowering Mastery<br> <p align="center">
</p>
</p>


## What is SCA-Goat?

SCAGoat is an application for Software Composition Analysis (SCA) that focuses on vulnerable and compromised JAR dependencies used in development code, providing users with hands-on learning opportunities to understand potential attack scenarios. It is designed to identify vulnerabilities that may arise from using vulnerable JAR files.

## Presented at:
- [DC32: Demo Labs](https://forum.defcon.org/node/249617)
- [Appsec Village: Arsenal](https://www.appsecvillage.com/events/dc-2024/arsenal-scagoat-661284)

## What All CVE Covered?

The CVEs covered under SCAGoat are primarily critical and high severity, which have a CVSS score of 9. This aid in understanding the vulnerable package being used and its potential for exploitation. 

In addition, there is one compromised package, that lacks a CVE, but is malicious by nature and cannot be detected with traditional SCA scanners.

| CVE                        | Package Name    | Link  | 
|----------------------------|-----------------|-------|
| CVE-2023-42282             | IP              | [https://nvd.nist.gov/vuln/detail/CVE-2023-42282](https://nvd.nist.gov/vuln/detail/CVE-2023-42282) |     
| CVE-2017-1000427           | Marked          | [https://nvd.nist.gov/vuln/detail/CVE-2017-1000427](https://nvd.nist.gov/vuln/detail/CVE-2017-1000427) |     
| CVE-2017-16114             | Marked          | [https://github.com/markedjs/marked/issues/926](https://github.com/markedjs/marked/issues/926) |
| CVE-2021-44228             | log4j           | [https://nvd.nist.gov/vuln/detail/CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228)|
| CVE-2020-9547              | jackson-databind | [https://nvd.nist.gov/vuln/detail/CVE-2020-9547](https://nvd.nist.gov/vuln/detail/CVE-2020-9547)|
| CVE-2021-33623             | trim-newlines   | [https://nvd.nist.gov/vuln/detail/CVE-2021-33623](https://nvd.nist.gov/vuln/detail/CVE-2021-33623)|
| CVE-2020-13935             | spring-websocket | [https://nvd.nist.gov/vuln/detail/CVE-2020-13935](https://nvd.nist.gov/vuln/detail/CVE-2020-13935)|
| Malicious Package (No CVE) | xz-java         | [https://central.sonatype.com/artifact/io.github.xz-java/xz-java](https://central.sonatype.com/artifact/io.github.xz-java/xz-java)|



## Steps to run SCAGoat
Step 1. Clone the application
```bash
git clone https://github.com/harekrishnarai/Damn-vulnerable-sca.git
```
Step 2. Go to the Directory
```bash
cd Damn-vulnerable-sca
```
Step 3. Use the following docker commands to build the image for the dockerfile and run the image to access the application:
```bash
docker compose up
```
Step 4. Visit http://localhost:3000/ to access the nodejs application and http://localhost:8080 for Springboot for log4j

### SCA Goat HomePage
![SCAGoat_HomePage](https://github.com/harekrishnarai/Damn-vulnerable-sca/assets/63994966/ffab6935-b44d-4925-a435-47d4a731702b)



## What's Coming?

Our aim is to provide you with a better understanding of vulnerable packages and JAR dependencies so that you can gain hands-on experience. We will keep you updated with the latest CVEs. Stay tuned! 

## Tutorials to exploit the vulnerability:

|  Demo Videos | CVE Exploited |
|---------------|-----------|
| [Demo 1](https://www.youtube.com/watch?v=MXAuqGiB354) |    CVE-2023-42282 |           
| [Demo 2](https://youtu.be/HgLKVtKh87w) |     CVE-2017-16114 |     
| [Demo 3](https://youtu.be/BljNgBZxbgo) |     CVE-2021-44228 |
| [Demo 4](https://youtu.be/BGGu9jAJQ1I) | CVE-2020-9547 |
| [Demo 5](https://youtu.be/sWAzUP_uC7k) | XZ-JAVA compromised |

## SCA Scan Reports
- [Link to SCAGoat Scan Reports](https://docs.google.com/document/d/1hJxweaRQsC3XH7t36UwOGBPbyZWX1ZjLtmOoJAI0nIc/edit?usp=sharing)
- [Detailed Dependency Check Tool Report](https://drive.google.com/file/d/1u3pfSI2_t3MOXDtwAiJXOM4Ekdxd5v8H/view?usp=sharing)

## Want to contribute? 
[![Fork this project](https://img.shields.io/github/forks/harekrishnarai/Damn-vulnerable-sca.svg?style=social)](https://github.com/harekrishnarai/Damn-vulnerable-sca/fork)
[![Start contributing](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/harekrishnarai/Damn-vulnerable-sca/issues)
<br>Awesome! The most basic way to show your support is to star the project or raise issues.

## Contributors
Thanks to all the people who already contributed!  
[Prashant Venkatesh](https://www.linkedin.com/in/prashant-venkatesh-99018999/)    
[Nandan Gupta](https://www.linkedin.com/in/nandan-gupta-698aa11b)  
[Hare Krishna Rai](https://www.linkedin.com/in/harekrishnarai/)  
[Henrik Plate](https://www.linkedin.com/in/henrikplate/)  
[Gaurav Joshi](https://www.linkedin.com/in/gauravjoshii/)  
[Yoad Fekete](https://www.linkedin.com/in/yoadfekete) 

<a href="https://github.com/harekrishnarai/Damn-vulnerable-sca/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=harekrishnarai/Damn-vulnerable-sca" />
</a>


