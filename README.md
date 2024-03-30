<p align="center">
    <img src="/static/images/logo.png" alt="SCA Goat">
     <br>SCA Goat<br> Navigating SCA Vulnerabilities, Empowering Mastery<br> <p align="center">
</p>
</p>


## What is SCA-Goat?

SCAGoat is an application for Software Composition Analysis (SCA) that focuses on vulnerable JAR dependencies used in development code, providing users with hands-on learning opportunities to understand potential attack scenarios. It is designed to identify vulnerabilities that may arise from using vulnerable JAR files.



## What All CVE Covered?

The CVEs covered under SCAGoat are primarily critical and high severity, which have a CVSS score of 9. This aid in understanding the vulnerable package being used and its potential for exploitation. 


| CVE           | Package Name | Link  | 
|---------------|--------------|-------|
| CVE-2023-42282 | IP           | [https://security.snyk.io/vuln/SNYK-JS-IP-6240864](https://security.snyk.io/vuln/SNYK-JS-IP-6240864) |     
| CVE-2017-1000427 | Marked     | [https://security.snyk.io/vuln/npm:marked:20170112](https://security.snyk.io/vuln/npm:marked:20170112) |     
| CVE-2017-16114 | Marked       | [https://github.com/markedjs/marked/issues/926](https://github.com/markedjs/marked/issues/926) |
| CVE-2021-44228 | log4j        | [https://nvd.nist.gov/vuln/detail/CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228)|


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
docker build -t sca-goat .
docker run -p 8000:3000 sca-goat
```
Step 4. Visit http://localhost:8000/ to access the application


## What's Coming?

Our aim is to provide you with a better understanding of vulnerable packages and JAR dependencies so that you can gain hands-on experience. We will keep you updated with the latest CVEs. Stay tuned! 

<br>

## POC :

|  Demo Videos |
|---------------|
| [Demo 1](https://www.youtube.com/watch?v=MXAuqGiB354) |               
| [Demo 2](https://youtu.be/HgLKVtKh87w) |          
| [Demo 3](https://youtu.be/BljNgBZxbgo) |       


## Want to contribute? 
[![Fork this project](https://img.shields.io/github/forks/harekrishnarai/Damn-vulnerable-sca.svg?style=social)](https://github.com/harekrishnarai/Damn-vulnerable-sca/fork)
[![Start contributing](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/harekrishnarai/Damn-vulnerable-sca/issues)
<br>Awesome! The most basic way to show your support is to star the project or raise issues.

## Contributors
Thanks to all the people who already contributed!
[Prashant Venkatesh](https://www.linkedin.com/in/prashant-venkatesh-99018999/)    
[Nandan Gupta](https://www.linkedin.com/in/prashant-venkatesh-99018999/)  
[Hare Krishna Rai](https://www.linkedin.com/in/harekrishnarai/)  
[Henrik Plate](https://www.linkedin.com/in/henrikplate/)  
[Gaurav Joshi](https://www.linkedin.com/in/gauravjoshii/)  

<a href="https://github.com/harekrishnarai/Damn-vulnerable-sca/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=harekrishnarai/Damn-vulnerable-sca" />
</a>


