import{ firstentered} from './firstenteredbyuser.js'
import { poiskgoroda } from './poiskgoroda.js';
import { pokazaniapogodu } from './pokazaniapogodu.js'
import {days7} from './7days.js';
const input = document.getElementById('city-input');
const datalist = document.getElementById('city-options');
const BoxsinoptikaDiv = document.querySelector('.Boxsinoptika')
let timeoutId;
const pokazatelDiv = document.querySelector('.pokazatelgoroda');
firstentered()
poiskgoroda(input, datalist, timeoutId)
 const datesContainer = document.querySelector('.tableofdays');
const createdCells = days7(datesContainer); 
pokazaniapogodu( timeoutId , datalist, pokazatelDiv, input,  createdCells, BoxsinoptikaDiv);
