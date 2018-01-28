var SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
var rec = new SpeechRecognition();
rec.continuous = false;
rec.interimResults = false;
rec.lang = 'ja-JP';

var searchStr = /あった|見つけた|コインだ/;

rec.onresult = function(e) {
    rec.stop();
    foundCoin();
    vm.getCoin();
}

function listenStop() {
    rec.onend = null;
    rec.stop();
}

function listenStart() {
    rec.onend = () => { rec.start() };
    rec.start();
}
