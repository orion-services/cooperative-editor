/**
 * @license
 * Copyright 2018,Instituto Federal do Rio Grande do Sul (IFRS)
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
class CooperativeEditorConfiguration extends CooperativeEditorConfigurationLocalization {
	
	static get is() { 
		return 'ce-configuration';
	}
	
	constructor(){
		super();
		this.soundTurnOn = true;
		this.soundTurnOff = false;
	}
	
	_soundSwitcher(){
		if (this.soundTurnOn){
			this.soundTurnOn = false;
			this.soundTurnOff = true;
		}
		else{
			this.soundTurnOn = true;
			this.soundTurnOff = false;
		}
	}
}
window.customElements.define(CooperativeEditorConfiguration.is, CooperativeEditorConfiguration);