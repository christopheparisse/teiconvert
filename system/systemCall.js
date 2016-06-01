/**
 * systemCall.js
 */

system.call = {};
system.address = 'php/teiconvert.php';

system.call.trsToTei = function(fname, teiname, datafrom, callback) {
    if (teiconvert.server === 'php')
        $.post(system.address,
            {from: fname, to: teiname, data: datafrom, cmd: 'fr.ortolang.teicorpo.TranscriberToTei', extin: '.trs', extout: '.tei_corpo.xml'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion depuis Transcriber (trs) (serveur distant) ' + mess);
            });
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.TranscriberToTEI -i fname -o teiname
    }
};

system.call.teiToTrs = function(teiname, destname, datafrom, callback) {
    if (teiconvert.server === 'php')
        $.post(system.address,
            {from: teiname, to: destname, data: datafrom, cmd: 'fr.ortolang.teicorpo.TeiToTranscriber', extin: '.tei_corpo.xml', extout: '.trs'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion vers TEI (serveur distant) ' + mess);
            });
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.TeiToTranscriber -i fname -o teiname
    }
};

system.call.chaToTei = function(fname, teiname, datafrom, callback) {
    if (teiconvert.server === 'php')
        $.post(system.address,
            {from: fname, to: teiname, data: datafrom, cmd: 'fr.ortolang.teicorpo.ClanToTei', extin: '.cha', extout: '.tei_corpo.xml'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion depuis CLAN (chat) (serveur distant) ' + mess);
            });
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.ChatToTEI -i fname -o teiname
    }
};

system.call.teiToCha = function(teiname, destname, datafrom, callback) {
    if (teiconvert.server === 'php')
        $.post(system.address,
            {from: teiname, to: destname, data: datafrom, cmd: 'fr.ortolang.teicorpo.TeiToClan', extin: '.tei_corpo.xml', extout: '.cha'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion vers TEI (serveur distant) ' + mess);
            });
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.TeiToChat -i fname -o teiname
    }
};

system.call.textgridToTei = function(fname, teiname, datafrom, params, callback) {
    if (teiconvert.server === 'php') {
/*        var dataView = new DataView(datafrom);
        var bytesArray = new Uint8Array(dataView.byteLength);
        for (var i = 0, l = dataView.byteLength; i < l; i++) {
            bytesArray[i] = dataView.getUint8(i);
        }
*/
        $.post(system.address,
            {from: fname, to: teiname, data: datafrom, cmd: 'fr.ortolang.teicorpo.PraatToTei', options: params, extin: '.textgrid', extout: '.tei_corpo.xml'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion depuis Praat (textgrid) (serveur distant) ' + mess);
            });
    }
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.PraatToTEI -i fname -o teiname
    }
};

system.call.teiToTextgrid = function(fname, teiname, datafrom, callback) {
    if (teiconvert.server === 'php') {
/*        var dataView = new DataView(datafrom);
        var bytesArray = new Uint8Array(dataView.byteLength);
        for (var i = 0, l = dataView.byteLength; i < l; i++) {
            bytesArray[i] = dataView.getUint8(i);
        }
*/
        $.post(system.address,
            {from: fname, to: teiname, data: datafrom, cmd: 'fr.ortolang.teicorpo.TeiToPraat', extin: '.tei_corpo.xml', extout: '.textgrid'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion vers Praat (textgrid) (serveur distant) ' + mess);
            });
    }
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.PraatToTEI -i fname -o teiname
    }
};

system.call.eafToTei = function(fname, teiname, datafrom, callback) {
    if (teiconvert.server === 'php')
        $.post(system.address,
            {from: fname, to: teiname, data: datafrom, cmd: 'fr.ortolang.teicorpo.ElanToTei', extin: '.eaf', extout: '.tei_corpo.xml'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion depuis ELAN (eaf) (serveur distant) ' + mess);
            });
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.ElanToTEI -i fname -o teiname
    }
};

system.call.teiToEaf = function(fname, teiname, datafrom, callback) {
    if (teiconvert.server === 'php')
        $.post(system.address,
            {from: fname, to: teiname, data: datafrom, cmd: 'fr.ortolang.teicorpo.TeiToElan', extin: '.tei_corpo.xml', extout: '.eaf'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion vers ELAN (eaf) (serveur distant) ' + mess);
            });
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.ElanToTEI -i fname -o teiname
    }
};

system.call.teiToTxm = function(fname, teiname, datafrom, params, callback) {
    if (teiconvert.server === 'php') {
        // message("Txm: " + fname + " " + teiname + " " + params);
        $.post(system.address,
            {from: fname, to: teiname, data: datafrom, cmd: 'fr.ortolang.teicorpo.TeiToTxm', options: params, extin: '.tei_corpo.xml', extout: '.txm.xml'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion depuis TEI_CORPO vers Txm (serveur distant) ' + mess);
            });
    }
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.PraatToTEI -i fname -o teiname
    }
};

system.call.teiToLexico = function(fname, teiname, datafrom, params, callback) {
    if (teiconvert.server === 'php') {
        // message("Lexico: " + fname + " " + teiname + " " + params);
        $.post(system.address,
            {from: fname, to: teiname, data: datafrom, cmd: 'fr.ortolang.teicorpo.TeiToLexico', options: params, extin: '.tei_corpo.xml', extout: '.lexico.txt'} )
            .done( function(dataresult) {
                callback(0, dataresult);
            })
            .fail( function(mess) {
                callback(1, 'Erreur de conversion depuis TEI_CORPO vers Lexico (serveur distant) ' + mess);
            });
    }
    else if (teiconvert.server === 'electron') {
        // java -cp conversions.jar fr.ortolang.teicorpo.PraatToTEI -i fname -o teiname
    }
};
