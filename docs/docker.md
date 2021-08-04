---
layout: default
title: Execute with docker
nav_order: 2
---

# Building and running with Docker

## Install dependencies

```bash
sudo apt-get install git maven npm docker-compose
```

## Download from GitHub

```bash
git clone https://github.com/rodrigoprestesmachado/cooperative-editor
cd cooperative-editor
```

## Configure

Create the `settings.xml` file in the `.m2/` directory. Thus, add
`.m2/settings.xml` to your home or, alternatively, add the `settings.xml` file
to the Maven installation at `${maven.home}/conf/settings.xml` (for more
information, please check the
[Maven Web Site](https://maven.apache.org/settings.html)). The `settings.xml`
file will contain information to replace some configuration options and deploy
Cooperative Editor to Wildfly. So, modify the below sample of `settings.xml`
file according to your server configuration:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <profiles>
         <profile>
             <id>Wildfly</id>
             <properties>
                 <wildfly.username>the admin username in wildfly</wildfly.username>
                 <wildfly.password>the admin password in wildfly</wildfly.password>
             </properties>
         </profile>
         <profile>
             <id>CooperativeEditor</id>
             <properties>
                 <replace.url>the url of your wildly server</replace.url>
                 <replace.port>the port of your wildfly server</replace.port>
                 <replace.communication>one gmail account (please, see the below note)</replace.communication>
             </properties>
         </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>Wildfly</activeProfile>
        <activeProfile>CooperativeEditor</activeProfile>
    </activeProfiles>
</settings>
```

E-mail configuration (optional):

The current implementation of the Cooperative Editor can optionally use a Gmail
account to send e-mail. Thus, configure it on the 'wildfly/standalone.xml' file
as in the example below:

```xml
<mail-session name="java:/CooperativeEditorEmail" jndi-name="java:/CooperativeEditorEmail" from="gmail">
    <smtp-server outbound-socket-binding-ref="mail-smtp-gmail" ssl="true" username="gmail" password="password" />
</mail-session>
```

## Build the front-end

To build the front-end, assuming the Cooperative Editor's is at
``$HOME/cooperative-editor``, run the commands:

```bash
cd $HOME/cooperative-editor/WebContent
npm install
npm run-script build
cp -r META-INF WEB-INF dist
```

## Build the back-end

To build the back-end, assuming the Cooperative Editor's is at
``$HOME/cooperative-editor``, run the commands:

```bash
cd $HOME/cooperative-editor
mvn replacer:replace compiler:compile resources:resources war:war
```

## Run with Docker

To run Cooperative Editor with Docker, run the commands:

```bash
cd $HOME/cooperative-editor
docker-compose up -d
```

