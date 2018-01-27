var SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
var rec = new SpeechRecognition();
rec.continuous = false;
rec.interimResults = false;
rec.lang = 'ja-JP';

var searchStr = /あった|見つけた|コインだ/;

rec.onresult = function(e) {
    rec.stop();
    for (var i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal && searchStr.test(e.results[i][0].transcript)) {
            console.log(e.results[i][0].transcript);
            vm.getCoin();
        }
    }
}

rec.onend = () => { rec.start() };

rec.start();

function listenStop() {
    rec.stop();
}

function listenStart() {
    rec.start();
}