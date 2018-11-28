/**
 * @license
 * Copyright 2017, Instituto Federal do Rio Grande do Sul (IFRS)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 		http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class SoundChat extends SoundChatLocalization {
	
	static get is() {
		return 'sound-chat'; 
	}
	
	static get properties() {
		return {
			/**
			 * Messages received
			 */
			receiveMessage: {
				type: Object,
				observer: '_receiveMessage',
				notify: true
			},
			/**
			 * Messages sent
			 */
			sendMessage: {
        type: Object,
        notify: true,
        readOnly: true
      }
		};
	}

	
	constructor() {
   		super();   		
   		this.messages = '';
   		// Count 50 actions with the keyboard
        this.countTypingMessages = 40;
        this.speakInTyping = 0;
   	}
		
   	ready(){
   		super.ready();   		
   		this.inputName = null;
   		this.messages = [];
   		this.isTyping = false;
   	}
   	
   	/**
	 * This method allows to add an input Name (from the old login windows) in
	 * the Sound Chat
	 * 
	 * @param String:
	 *            The name of the connect user
	 */
   	_setInputName(name){
   		// It cThe login variable can be set to true
   		this.inputName = name;
   	}
   	
   /**
    * Sends the message typing to the server. With this message the server can
	* broadcast a message to to inform that someone is typing 
    */
   typingEvent(event){
	   if (event.keyCode !== 9 && event.keyCode !== 18) // TAB and ALT
		   if (event.keyCode === 13){
			   this.sendMessageAction();
			   this.$.inputMessage.value = "";
	   		}
	   		else
	   			this._setSendMessage({type:'TYPING'});
	   		
   }
       
   /**
	 * Enable login with the user press enter/return button in login name field
	 */
   enterEvent(event){
	   if (event.keyCode === 13){
		   this.$.windowLogin.opened = false;
   		}
   }
    
   /**
	 * Method used to send a message to other users
	 */
   sendMessageAction() {
	   if (this.$.inputMessage.value !== ""){
		   var msg = this.escapeCharacters(this.$.inputMessage.value);
		   if (typeof msg !== 'undefined'){ 
		  	 this._setSendMessage({type:'SEND_MESSAGE',textMessage:msg});
    		 this.$.inputMessage.value = "";
		   }
	   }
   }
    
   /**
	 * Escape special characters to keep the json message in the right format
	 */
   escapeCharacters(message){
	   if (typeof message !== 'undefined'){
		   message = message.replace(/"/g,"\\\"");
    	   message = message.replace(/'/g,"\\\"");
	   }
	   return message;
   }
    
   /**
    * Handle the messages from the server
    */
   _receiveMessage(json) {
	   try{
		   if (json.type === 'ACK_LOAD_INFORMATION')
			   this._ackConnectHandler(json.messages);
		   else if (json.type === 'ACK_SEND_MESSAGE')
			   this._ackSendMessageHandler(json);
		   else if (json.type === 'ACK_TYPING')
			   this._ackTypingHandler(json);
		   else if (json.type === 'ACK_FINISH_PARTICIPATION')
			   this.$.inputMessage.focus();
	   } 
	   catch(err) {
		   this.domHost.playTTS(super.localize("error"));
	   }
   }
   
   /**
    * Private method to handle the ACK_NEW_CONNECTED message from server
    * 
    * @param The JSON message
    */
   _ackConnectHandler(messages){
	   // Add stored messages
	   if ((messages !== "") && (this.messages.length === 0)){
		   for (var x in messages){
			   var message = messages[x];
			   this.push('messages', {"user": message.user, "message": message.textMessage, "time": message.time});
		   }
	   } 
   }
   
   /**
    * Private method to handle the ACK_SEND_MESSAGE message from server
    * 
    * @param The JSON message
    */
   _ackSendMessageHandler(json){
	  
  		this.push('messages', {"user": json.user, "message": json.message, "time": json.time});
  		this.domHost.playSound("sendMessage", json.effect, json.position);
  		
  		// We will test the name of the user in live region
  		//if (json.user !== CooperativeEditorParticipants.userName )
  			 //this.domHost.playTTS(json.user);
  		
  		this.isTyping = false;
   }
   
   /**
    * Private method to handle the ACK_TYPING message from server
    * 
    * @param The JSON message
    */
   _ackTypingHandler(json){
       
       var playTyping = false;
       this.isTyping = true;
       this.updateScroll();
       
       if (this.countTypingMessages === 40){
    	   this.countTypingMessages = 0;
    	   playTyping = true;
       }  
       else
           this.countTypingMessages++;
       
       if ((json.user !== CooperativeEditorParticipants.userName) && (playTyping)){
           this.domHost.playSound("typing", json.effect, json.position);
           if (this.speakInTyping === 2){
        	   this.domHost.playTTS(json.user + ',' + this.localize('typingMessage'));
        	   this.speakInTyping = 0;
           }
           else
        	   this.speakInTyping++;
       }
   }
   
   /**
    * Log the keyboard navigation of the users 
    */
   _browse(){
  	 this._setSendMessage({type:'BROWSE'});
   }
   
   /**
    * Set the focus to Sound Chat input area
    */
   setFocus(){
	  this.$.inputMessage.focus();
	  this.domHost.playSound("moveCursor", "", "");
	  this._setSendMessage({type:'FOCUS_CHAT'});
   }
   
   /**
    * Read the last five messages to the users 
    */
   readLatestMessages(messageNumber){
	   var spansMessage = this.$.messageList.getElementsByClassName('message');
	   var start = messageNumber < spansMessage.length ? (spansMessage.length - 1) - (messageNumber - 1) : 0;
	  	   
	   for (var x = start; x < spansMessage.length ; x++){
         this.domHost.playTTS(spansMessage[x].innerText);
       }
	   
//	   var entireMessages = this.get('messages');
//       if (messageNumber > entireMessages.length)
//    	   		messageNumber = entireMessages.length;
//    	   
//     var begin = Math.abs(messageNumber - entireMessages.length);
//     var end = Math.abs(messageNumber - entireMessages.length) + messageNumber;     
//     var latestMessages = entireMessages.slice(begin,end);
//     var strMessages = "";
//     for (var x in  latestMessages){
//         var message = latestMessages[x];
//         strMessages += message.user + ", " + message.message + ", ";
//     }
//     
//     this.domHost.playTTS(strMessages);
     this._setSendMessage({type:'READ_CHAT'});
   }
   
   /**
	 * This method updates the position of a new message on the page (scroll)
	 */
   updateScroll(){
   		if (this.$.messageList.scrollHeight > this.$.messageList.offsetHeight){
   			this.$.messageList.scrollTop = this.$.messageList.scrollHeight - this.$.messageList.offsetHeight;
   		}
   	}
}

window.customElements.define(SoundChat.is, SoundChat);