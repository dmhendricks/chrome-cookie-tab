import { render } from 'preact';
import { App } from './App';
import { Socket } from './socket';

const tabId = chrome.devtools.inspectedWindow.tabId;
const socket = new Socket(tabId);

const root = document.getElementById('app');
if (root) render(<App socket={socket} />, root);