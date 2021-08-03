---
layout: default
title: Installation
nav_order: 3
---

# Installation

* The Cooperative Editor is a JEE application tested in Wildfly (11.0.0.Final) with MySQL (5.5) database over an Ubuntu Server (14.04 - trusty)

# Wildfly

**An importante note:** to run Cooperation Editor, Wildfly must use `wildfly/standalone/configuration/standalone-full.xml ` version. Thus, rename the `standalone-full.xml` file to `standalone.xml`.

# MySQL datasource

1. Deploy an MySQL JDBC driver in the Wildfly 
1. In your Wildfly control panel, configure your a MySQL Datasource (Non-XA) to access the database through the following
JNI name `java:/CooperativeEditorDS`. 

# E-mail configuration
Cooperative Editor sends e-mails to invite the users to join in one activity
In `standalone/configuration/standalone.xml` file, find `<subsystem xmlns=”urn:jboss:domain:mail:3.0″>` and add:
```xml
<mail-session name=”java:/CooperativeEditorEmail” from=”cooperative.editor@gmail.com” jndi-name=”java:/CooperativeEditorEmail””>
    <smtp-server password=”your password” username=”your gmail account” ssl=”true” 
         outbound-socket-binding-ref=”mail-smtp-gmail”/>
</mail-session>
```

After, find `<socket-binding-group name=”standard-sockets” default-interface=”public” port offset=”${jboss.socket.binding.port-offset:0}”>` and add:

```xml
<outbound-socket-binding name=”mail-smtp-gmail” source-port=”0″ fixed-source-port=”false”>
    <remote-destination host=”smtp.gmail.com” port=”465″/>
</outbound-socket-binding>
```

Finally, find messaging-activemq session:
```xml
<subsystem xmlns="urn:jboss:domain:messaging-activemq:2.0">
    <server name="default">
```
And add the Cooperative Editor queue:

```xml
<jms-queue name="CooperativeEditorEmailQueue" entries="java:/jms/queue/CooperativeEditorEmailQueue"/>
```

# Compilation, packaging and installation with Maven

At present, the front-end and the back-end are not integrated on a single build system and thus need to be built separately.

## Downloading

To download Cooperative Editor's source code, run the command:

``git clone https://github.com/rodrigoprestesmachado/cooperative-editor``

## Building the front end

The build system of the front-end is based on NPM, which can be installed on Ubuntu by running the command:

``sudo apt-get install npm``

With NPM installed and assuming Cooperative Editor's source code is at ``$HOME/cooperative-editor``, the front-end can be built by running the commands:

```bash
cd $HOME/cooperative-editor/WebContent
npm run-script build
cp -r META-INF WEB-INF dist
```

## Building the back-end

The easiest way to build the back-end is by using Maven, which can be installed on Ubuntu by running the command:

``sudo apt-get install maven`` (note: use maven latest)

After installing Maven, you will need to create the `settings.xml` file in the `.m2/` directory. Thus, add `.m2/settings.xml` to your home or, alternatively, add the `settings.xml` file to the Maven installation at `${maven.home}/conf/settings.xml` (for more information, please check [Maven Web Site](https://maven.apache.org/settings.html)). The `settings.xml` file will contain information to replace some configurations and deploy Cooperative Editor in Wildfly. So, modify the below sample of `settings.xml` file according your server configuration:

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
                 <replace.communication>the gmail account</replace.communication>
             </properties>
         </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>Wildfly</activeProfile>
        <activeProfile>CooperativeEditor</activeProfile>
    </activeProfiles>
</settings>
```

After building the front-end, build the back-end by running the commands (assuming Cooperative Editor's source code is at ``$HOME/cooperative-editor``):

``bash
cd $HOME/cooperative-editor
mvn replacer:replace compiler:compile resources:resources war:war wildfly:deploy
``

## Creating a shell script

If you prefer, you can build Cooperative Editor by creating a shell script on your Ubuntu server, for example:

```bash
#!/bin/sh

set -e
CE_PATH="$HOME/cooperative-editor"

#Download
git clone https://github.com/rodrigoprestesmachado/cooperative-editor

#Build the front-end
cd "$CE_PATH/WebContent"
npm run-script build
cp -r META-INF WEB-INF dist

#Build the back-end
cd "$CE_PATH"
mvn replacer:replace compiler:compile resources:resources war:war wildfly:deploy

#Clean up
cd "$CE_PATH/.."
rm -Rf cooperative-editor
```

# Load data

Once installed, you can load some [sound effects ](https://github.com/rodrigoprestesmachado/cooperative-editor/blob/master/src/META-INF/sql/sound-effect.sql) in the data base

