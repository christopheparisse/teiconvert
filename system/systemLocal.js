/**
 * systemLocal.js
 * function called from local html file
 */

/* global saveAs */
/* global TextDecoder */

if (typeof system === 'undefined')
	var system = {};

system.saveFileLocal = function(type, name, data) {
    var mimeType, blob;
    if (type === null)
        mimeType = "text/plain;charset=utf-8";
    else if (type === '.docx')
        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (type === '.xlsx')
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    else if (type === teiconvert.EXTENSION)
        mimeType = "text/xml";
    else if (type === '.trs')
        mimeType = "text/xml";
    else if (type === '.eaf')
        mimeType = "text/xml";
    else if (type === '.textgrid')
        mimeType = "text/plain;charset=utf-8";
    else if (type === '.cha')
        mimeType = "text/plain;charset=utf-8";
    else if (type === '.txt')
        mimeType = "text/plain;charset=utf-8";
    else
        mimeType = "application/octet-stream";
    if (type !== '.docx' || type !== '.xlsx')
        blob = new Blob([data], {
            type : mimeType
        });
    else
        blob = data;
    var p1 = name.lastIndexOf('/');
    var p2 = name.lastIndexOf('\\');
    if (p1 < p2) p1 = p2;
    if (p1 === -1) p1 = 0;
    var l = name.substr(p1);
    saveAs(blob, l);
};

system.openLocalFile = function(e) {
	var files = e.target.files;
    teiconvert.praat.skip = false; // authorize again praat options
    processFilesObjs(0, files);
};

function evaluateEncoding(data, codepage, mess) {
    // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
    var decoder = new TextDecoder(codepage);
    var decodedString = decoder.decode(data);
    // test if encoding is codepage
    // compute the number of é è à ç
    var i, found;
    if (!mess) mess = '';
    for (i=0, found=0; i < decodedString.length; i++) {
        if ('1aAéèçàùœ€ëüîôûÇÊæ'.indexOf(decodedString.charAt(i)) > -1)
            found ++;
    }
    mess += 'Praat ' + codepage + ' found ' + found + '<br/>';
    return {found: found, mess: mess};
}

/**
 * read a transcription from a FILE object with FileReader
 * @method readFileObj
 * @param File object
 */
function readFileObj(f, sync) {
	var reader = new FileReader();
    var binary = teiconvert.binaryFormat(f.name);
    var xml = teiconvert.xmlFormat(f.name);
    var rawText = teiconvert.rawTextFormat(f.name);
	// Closure to capture the file information.
	reader.onload = function(e) {
        if (xml) {
            var dataView = new DataView(e.target.result);
            // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
            var decoder = new TextDecoder('UTF-8');
            var decodedString = decoder.decode(dataView);
            // test if encoding is UTF-8 - if not read again with correct encoding
            var head = /<.xml.*?encoding="(.*?)".*>.*/.exec(decodedString);
            if (head && head[1].toUpperCase() !== "UTF-8") {
                decoder = new TextDecoder(head[1]);
                console.log('text encoding is non UTF-8: use ' + head[1]);
                decodedString = decoder.decode(dataView);
        		teiconvert.process(f.name, decodedString, sync);
                return;
            } else {
        		teiconvert.process(f.name, decodedString, sync);
            }
        } else if (rawText) {
            var dataView = new DataView(e.target.result);
            var bestScore=0, bestCodepage='', mess='';
            var ev = evaluateEncoding(dataView, 'UTF-16BE', mess);
            mess = ev.mess;
            if (bestScore < ev.found) {
                bestScore = ev.found;
                bestCodepage = 'UTF-16BE';
            }
            ev = evaluateEncoding(dataView, 'UTF-8', mess);
            mess = ev.mess;
            if (bestScore < ev.found) {
                bestScore = ev.found;
                bestCodepage = 'UTF-8';
            }
            ev = evaluateEncoding(dataView, 'windows-1252', mess);
            mess = ev.mess;
            if (bestScore < ev.found) {
                bestScore = ev.found;
                bestCodepage = 'windows-1252';
            }
            ev = evaluateEncoding(dataView, 'ISO-8859-1', mess);
            mess = ev.mess;
            if (bestScore < ev.found) {
                bestScore = ev.found;
                bestCodepage = 'ISO-8859-1';
            }

            if (bestScore > 0) {
                // mess += bestCodepage + ' est utilisé';
                // message(mess);
                decoder = new TextDecoder(bestCodepage);
                decodedString = decoder.decode(dataView);
        		teiconvert.process(f.name, decodedString, sync);
        		return;
            }

            // mess += 'Praat UTF-8 est utilisé par défaut';
            // message(mess);
            decoder = new TextDecoder('UTF-8');
            decodedString = decoder.decode(dataView);
       		teiconvert.process(f.name, decodedString, sync);
        } else
    		teiconvert.process(f.name, e.target.result, sync);
	};
	if (binary)
        reader.readAsBinaryString(f);
    else if (xml || rawText)
       	reader.readAsArrayBuffer(f);
    else
       	reader.readAsText(f);
}

function handleDrop(e) {
	e.stopPropagation();
	e.preventDefault();
	var files = e.dataTransfer.files;
    teiconvert.praat.skip = false; // authorize again praat options
    processFilesObjs(0, files);
}

function processFilesObjs(i, files) {
    if (i >= files.length)
        return;
    var sync = teiconvert.syncFormat(files[i].name);
    if (!sync) {
       	readFileObj(files[i]);
        processFilesObjs(i+1, files);
    } else
        readFileObj(files[i], function () { processFilesObjs(i+1, files); });
}

function handleDragover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

system.initDrop = function() {
	var drop = document.getElementById('drop');
	if(drop.addEventListener) {
		drop.addEventListener('dragenter', handleDragover, false);
		drop.addEventListener('dragover', handleDragover, false);
		drop.addEventListener('drop', handleDrop, false);
	}
}
