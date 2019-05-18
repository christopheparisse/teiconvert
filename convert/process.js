/**
 * process.js
 */

/* global $ */

var teiconvert = {};

teiconvert.praat = {}; // for praat conversion to tei parameters
teiconvert.praat.allow = true;
teiconvert.praat.params = '-d ';
teiconvert.praat.relations = [];

teiconvert.SYNC_FILES = '|.textgrid|';
teiconvert.RAWTEXT_FILES = '|.textgrid|';
teiconvert.BINARY_FILES = '|.docx|.xlsx|';
teiconvert.EXTENSION = '.tei_corpo.xml';
teiconvert.TEXT_FILES = '|' + teiconvert.EXTENSION + '|.lexico.txt|.txm.xml|.teiml|.trjs|.xml|.cha|.eaf|.exb|.txt|.srt|.csv|.textgrid|.trs|';
teiconvert.XML_FILES = '|' + teiconvert.EXTENSION + '|.teiml|.trjs|.xml|.trs|.eaf|.exb|';

teiconvert.server = 'php';

teiconvert.fileFormat = function(fname) {
    var m = (teiconvert.TEXT_FILES+teiconvert.BINARY_FILES).split('|');
    for (var i=0 ; i < m.length ; i++)
        if (m[i]) {
            var p = fname.toLowerCase().lastIndexOf(m[i]);
            if (p === -1) continue;
            if (p === fname.length - m[i].length) {
                if (m[i] === '.teiml' || m[i] === '.xml' || m[i] === '.trjs')
                    return teiconvert.EXTENSION;
                return m[i];
            }
        }
    return '.unknown';
};

teiconvert.testFormat = function(fname, setofext) {
    var m = setofext.split('|');
    for (var i=0 ; i < m.length ; i++)
        if (m[i]) {
            var p = fname.toLowerCase().lastIndexOf(m[i]);
            if (p === -1) continue;
            if (p === (fname.length - m[i].length))
                return m[i];
        }
    return null;
};

teiconvert.binaryFormat = function(fname) {
    return teiconvert.testFormat(fname, teiconvert.BINARY_FILES);
};

teiconvert.xmlFormat = function(fname) {
    return teiconvert.testFormat(fname, teiconvert.XML_FILES);
};

teiconvert.rawTextFormat = function(fname) {
    return teiconvert.testFormat(fname, teiconvert.RAWTEXT_FILES);
};

teiconvert.syncFormat = function(fname) {
    return teiconvert.testFormat(fname, teiconvert.SYNC_FILES);
};

teiconvert.dest = function () {
    var val = $('input:radio[name=format]:checked').val();
    if (val === 'tei') return teiconvert.EXTENSION;
    if (val === 'trs') return '.trs';
    if (val === 'cha') return '.cha';
    if (val === 'eaf') return '.eaf';
    if (val === 'textgrid') return '.textgrid';
    if (val === 'docx') return '.docx';
    if (val === 'xlsx') return '.xlsx';
    if (val === 'txt') return '.txt';
    if (val === 'srt') return '.srt';
    if (val === 'csv') return '.csv';
    if (val === 'txm') return '.txm.xml';
    if (val === 'lexico') return '.lexico.txt';
};

teiconvert.paramsOutDisp = function() {
    var val = $('input:radio[name=format]:checked').val();
    if (val === 'tei') {
        $('#paramdocx').hide();
        $('#paramtxt').hide();
        $('#paramxlsx').hide();
        $('#paramtxmlexico').hide();
        $('#paramtall').hide();
    } else if (val === 'trs' || val === 'cha'  || val === 'textgrid' || val === 'eaf') {
        $('#paramdocx').hide();
        $('#paramtxt').hide();
        $('#paramxlsx').hide();
        $('#paramtxmlexico').hide();
        $('#paramtall').show();
    } else if (val === 'txt') {
        $('#paramdocx').hide();
        $('#paramtxt').show();
        $('#paramxlsx').hide();
        $('#paramtxmlexico').hide();
        $('#paramtall').show();
    } else if (val === 'txm' || val === 'lexico') {
        $('#paramdocx').hide();
        $('#paramtxt').hide();
        $('#paramxlsx').hide();
        $('#paramtxmlexico').show();
        $('#paramtall').show();
    } else if (val === 'docx') {
        $('#paramdocx').show();
        $('#paramtxt').hide();
        $('#paramxlsx').hide();
        $('#paramtxmlexico').hide();
        $('#paramtall').show();
    } else if (val === 'xlsx' || val === 'csv') {
        $('#paramdocx').hide();
        $('#paramtxt').hide();
        $('#paramxlsx').show();
        $('#paramtxmlexico').hide();
        $('#paramtall').show();
    }
};

teiconvert.getOptions = function() {
    var params = localStorage.getItem('paramsPraatOptions');
    if (params && params === "false") {
        teiconvert.praat.allow = false;
        $('input:checkbox[name=praatoptions]').prop('checked', false);
    } else {
        teiconvert.praat.allow = true;
        $('input:checkbox[name=praatoptions]').prop('checked', true);
    }

    var radios = $('input:radio[name=paramdocx]');
    params = localStorage.getItem('paramsDocxOptions');
    radios.filter('[value="' + params + '"]').prop('checked', true);

    radios = $('input:radio[name=paramxlsx]');
    params = localStorage.getItem('paramsXlsxOptions');
    radios.filter('[value="' + params + '"]').prop('checked', true);

    radios = $('input:radio[name=paramtxt]');
    params = localStorage.getItem('paramsTxtOptions');
    radios.filter('[value="' + params + '"]').prop('checked', true);

    radios = $('input:radio[name=ajoutsuppr]');
    params = localStorage.getItem('paramsTierOptions');
    radios.filter('[value="' + params + '"]').prop('checked', true);
    
    params = localStorage.getItem('paramsDocxNumber');
    $('#digitsdocx').val(params);
    
    params = localStorage.getItem('paramsXlsxNumber');
    $('#digitsxlsx').val(params);
    
    params = localStorage.getItem('paramsTxtNumber');
    $('#digitstxt').val(params);

    radios = $('input:checkbox[name=sectionlex]');
    params = localStorage.getItem('paramsTxmSection');
    if (params === 'on')
        radios.prop('checked', true);
    else
        radios.prop('checked', false);

    radios = $('input:checkbox[name=rawline]');
    params = localStorage.getItem('paramsrawline');
    if (params === 'on')
        radios.prop('checked', true);
    else
        radios.prop('checked', false);
}

teiconvert.setOptions = function() {
    localStorage.setItem('paramsPraatOptions', teiconvert.praat.allow === true ? 'true' : 'false');
    var val = $('input:radio[name=paramdocx]:checked').val();
    localStorage.setItem('paramsDocxOptions', val);
    var val = $('input:radio[name=paramxlsx]:checked').val();
    localStorage.setItem('paramsXlsxOptions', val);
    val = $('input:radio[name=paramtxt]:checked').val();
    localStorage.setItem('paramsTxtOptions', val);
    val = $('input:radio[name=ajoutsuppr]:checked').val();
    localStorage.setItem('paramsTierOptions', val);
    val = $('#digitsdocx').val();
    localStorage.setItem('paramsDocxNumber', val);
    val = $('#digitsxlsx').val();
    localStorage.setItem('paramsXlsxNumber', val);
    val = $('#digitstxt').val();
    localStorage.setItem('paramsTxtNumber', val);
    val = $('input:checkbox[name=sectionlex]:checked').val();
    localStorage.setItem('paramsTxmSection', val);
    val = $('input:checkbox[name=rawline]:checked').val();
    localStorage.setItem('paramsTxmrawline', val);
}

teiconvert.setOptionsTxm = function() {
    var valType = $('#tvtype').val();
    var valVal = $('#tvvaleur').val();
    if (valType && valVal) {
        $("#tvlist").show();
        var typeval = '<li><span class="spantvtype">' + valType + '</span> =&gt; <span class="spantvvaleur">'  + valVal+ '</span> <button onclick="teiconvert.removeTV(event);">Supprimer</button></li>';
        $('#tvul').append(typeval);
    }
}

teiconvert.removeTV = function(e) {
    $(e.target).parent().remove();
}

teiconvert.paramsPraat = function() {
        $('#parampraat').show();
}

function message(s) {
    $('#result').append('<li>' + s + '</li>');
}

// datainit : raw data from local files
// dateinterm : return value of process_in - true result saved with saveas
// datefinal : return value of process_out - true result saved with saveas
teiconvert.process = function(fname, datainit, sync) {
    trjs.data.leftBracket = '<'; // '⟪', // 27EA - '❮', // '⟨' 27E8 - '❬'
    trjs.data.rightBracket = '>'; // '⟫', // 27EB - '❯', // '⟩' 27E9 - '❭' - 276C à 2771 ❬ ❭ ❮ ❯ ❰ ❱
    trjs.data.leftEvent = '['; // '⟦', // 27E6 - '『', // 300E - '⌈', // u2308
    trjs.data.rightEvent = ']'; // '⟧', // 27E7 - '』', // 300F - '⌋', // u230b

    var formatdest = teiconvert.dest();
    // message('TASK: ' + teiconvert.fileFormat(fname) + ' vers ' + formatdest);
    if (teiconvert.fileFormat(fname) === formatdest) {
		message('Pas de conversion dans le même format');
        if (sync) sync();
        return;
    }
    if (teiconvert.fileFormat(fname) === teiconvert.EXTENSION) {
        var destname = fname + formatdest;
        teiconvert.process_out(fname, datainit, destname, function(err, datafinal) {
            // message(err + ' OUT ' + 'Conversion de ' + fname + ' final: ' + formatdest);
            if (err) {
                message('Erreur de conversion vers le format ' + formatdest + ': ' + datafinal);
            } else {
                message('Conversion de <i>' + fname + '</i> vers <i>' + destname + '</i>');
                system.saveFileLocal(formatdest, destname, datafinal);
            }
            if (sync) sync();
        });
        return;
    }
    var teiname = fname + teiconvert.EXTENSION;
    teiconvert.process_in(fname, datainit, teiname, function(err, datainterm) {
        // message(err + ' IN ' + 'Conversion de ' + fname + ' vers ' + teiname + ' final: ' + formatdest);
        if (err) {
    		message('Erreur de conversion vers la TEI: ' + datainterm);
            if (sync) sync();
        } else {
            if (formatdest === teiconvert.EXTENSION) {
                message('Conversion de <i>' + fname + '</i> vers <i>' + teiname + '</i>');
                system.saveFileLocal(teiconvert.EXTENSION, teiname, datainterm);
                if (sync) sync();
                return;
            }
            var destname = fname + formatdest;
            teiconvert.process_out(teiname, datainterm, destname, function(err, datafinal) {
                // message(err + ' OUT ' + 'Conversion de ' + fname + ' TEI ' + teiname + ' final: ' + formatdest);
                if (err) {
                    message('Erreur de conversion vers le format ' + formatdest + ': ' + datafinal);
                } else {
                    message('Conversion de <i>' + fname + '</i> vers <i>' + destname + '</i>');
                    system.saveFileLocal(formatdest, destname, datafinal);
                }
                if (sync) sync();
        });
        }
    });
};

/*
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
*/

teiconvert.process_in = function(fname, datafrom, teiname, callback) {
        document.body.style.cursor = 'progress';
        $('#resultinfo').text('En cours de traitement...').css('background','#FF0');
        function callback1(err, data) {
            document.body.style.cursor = 'default';
            $('#paramspraat').hide();
            $('#resultinfo').text('Résultats').css('background','#FFF');
            callback(err, data);
        }
        switch (teiconvert.fileFormat(fname)) {
            case '.txt':
                var result =  teiConvertTools.textToTEI(datafrom);
                callback1(0, result);
                break;
            case '.docx':
                result =  teiConvertTools.docxToTEI(datafrom);
                callback1(0, result);
                break;
            case '.xlsx':
                result =  teiConvertTools.xlsxToTEI(datafrom);
                callback1(0, result);
                break;
            case '.trs':
                var head = /<.xml.*?encoding="(.*?)".*>.*/.exec(datafrom);
                if (head && head[1].toUpperCase() !== "UTF-8") {
                    var modif = datafrom.replace('"' + head[1] + '"', '"UTF-8"');
                    // console.log(modif);
                    system.call.trsToTei(fname, teiname, modif, callback1);
                } else
                    system.call.trsToTei(fname, teiname, datafrom, callback1);
                break;
            case '.cha':
                system.call.chaToTei(fname, teiname, datafrom, callback1);
                break;
            case '.srt':
                system.call.srtToTei(fname, teiname, datafrom, callback1);
                break;
            case '.eaf':
                system.call.eafToTei(fname, teiname, datafrom, callback1);
                break;
            case '.textgrid':
                optionsTextGrid(fname, teiname, datafrom, callback1);
                break;
            default:
                // no conversion
                callback1(1, 'format inconnu');
                break;
        }
};

teiconvert.process_out = function(teiname, datafrom, destname, callback) {
        var params;
        var valCT;
        document.body.style.cursor = 'wait';
        $('#resultinfo').text('En cours de traitement...').css('background','#FF0');
        function callback1(err, data) {
            document.body.style.cursor = 'default';
            $('#resultinfo').text('Résultats').css('background','#FFF');
            callback(err, data);
        }
        params = " ";
        valCT = $('input:checkbox[name=rawline]:checked').val();
        if (valCT === 'on')
            params += ' -rawline';
        params += getUsers();
        switch (teiconvert.fileFormat(destname)) {
            case '.txt':
                var result = teiConvertTools.teiToText(datafrom);
                callback1(0, result);
                break;
            case '.trs':
                system.call.teiToTrs(teiname, destname, datafrom, params, callback1);
                break;
            case '.cha':
                system.call.teiToCha(teiname, destname, datafrom, params, callback1);
                break;
            case '.eaf':
                system.call.teiToEaf(teiname, destname, datafrom, params, callback1);
                break;
            case '.textgrid':
                system.call.teiToTextgrid(teiname, destname, datafrom, params, callback1);
                break;
            case '.docx':
                result = teiConvertTools.teiToDocx(datafrom);
                // alert(result);
                callback1(0, result);
                break;
            case '.xlsx':
                result = teiExportXlsx.teiToXlsx(teiname, datafrom);
                // alert(result);
                callback1(0, result);
                break;
            case '.csv':
                result = teiExportXlsx.teiToCsv(teiname, datafrom);
                // alert(result);
                callback1(0, result);
                break;
            case '.txm.xml':
                teiConvertTools.teiToTxm(teiname, destname, datafrom, callback1);
                break;
            case '.lexico.txt':
                teiConvertTools.teiToLexico(teiname, destname, datafrom, callback1);
                break;
            default:
                break;
        }
};

function readNamesTextGrid(obj) {
    var lns = obj.toString().split(/[\n\r]+/);
    var names = [];
    for (var i=0; i<lns.length; i++) {
//        if (lns[i].indexOf('name') >= 0)
//          console.log(i+1 + ' ' + lns[i]);
        var t = /\s+name\s+=\s+"(.+)".*/.exec(lns[i]);
        if (t)
            names.push(t[1]);
    }
    return names;
}

function optionsTextGrid(fname, teiname, datafrom, callback1) {
    if (!teiconvert.praat.restore) {
        // this the first use of this page for this session
        var params;
        params = localStorage.getItem('paramsPraatRelations');
        if (params) {
            params = JSON.parse(params);
            if (params) teiconvert.praat.relations = params;
        }
        teiconvert.praat.restore = 'done';
        teiconvert.praat.skip = false;
        // compute the parameters.
        teiconvert.praat.params = teiconvert.computeParams();
        // alert("optionsTextGrid " + teiconvert.praat.params);
    }
    if (teiconvert.praat.skip === true || teiconvert.praat.allow === false) { // options are set: skip this
        // alert("DIRCETCALL " + teiconvert.praat.params);
        system.call.textgridToTei(fname, teiname, datafrom, teiconvert.praat.params, callback1);
    } else { // show options for praat and wait for action
        document.body.style.cursor = 'default';
        $('#resultinfo').text('Résultats').css('background','#FFF');
        teiconvert.praat.names = readNamesTextGrid(datafrom);
        teiconvert.praat.fname = fname;
        teiconvert.praat.teiname = teiname;
        teiconvert.praat.datafrom = datafrom;
        teiconvert.praat.callback = callback1;
        if (teiconvert.praat.relations === undefined) teiconvert.praat.relations = [];
        $('#paramspraat').show();
        var t = '<table><thead><tr><th>Tier</th><th>Relation</th><th>Parent</th></tr></thead><tbody><tr><td>';
        for (var i=0; i<teiconvert.praat.names.length; i++) {
            t += '<input type="radio" name="praatleft" value="l' + i + '"/> ' + teiconvert.praat.names[i] + '<br />';
        }
        t += '</td><td>';
        t += '<input type="radio" name="praatmiddle" value="assoc"/>Association symbolique<br />';
        t += '<input type="radio" name="praatmiddle" value="timediv"/>Division temporelle<br />';
        t += '<input type="radio" name="praatmiddle" value="incl"/>Inclusion temporelle<br />';
        t += '</td><td>';
        for (var i=0; i<teiconvert.praat.names.length; i++) {
            t += '<input type="radio" name="praatright" value="r' + i + '"> ' + teiconvert.praat.names[i] + '<br />';
        }
        t += '</td><td><input id="praatajoutrelation" type="button" value="Ajouter la relation" onclick="teiconvert.addRelation();"/></td></tr></tbody></table>';
        $('#praatlist').html(t).show();
        $('#praatrules').html('').show();
        $('#fnpraat').text(fname);
        teiconvert.displayRelation();
    }
}

teiconvert.addRelation = function() {
    var valg = $('input:radio[name=praatleft]:checked').val();
    var valm = $('input:radio[name=praatmiddle]:checked').val();
    var vald = $('input:radio[name=praatright]:checked').val();
    if (!valg || !valm || !vald) {
        alert('Il faut choisir trois valeurs !');
        return;
    }
    var i = Number(valg.substr(1));
    var j = Number(vald.substr(1));
    if (i === j) {
        alert('Une relation ne peut pas être entre un tier et lui-même !');
        return;
    }
    var l = teiconvert.praat.names[i];
    var d = teiconvert.praat.names[j];
    var n = teiconvert.praat.relations.length;
    teiconvert.praat.relations.push( [l, valm, d] );
    $('#praatrules').append('<p><span class="praatcommand">'
        + '<span class="rl">' + l + '</span>'
        + '<span class="rm">' + valm + '</span>'
        + '<span class="rd">' + d + '</span>'
        + '</span> <input type="button" value="Supprimer la relation" onclick="teiconvert.removeRelation(' + n + ');"/></p>');
    var paramsall = JSON.stringify(teiconvert.praat.relations);
    localStorage.setItem('paramsPraatRelations', paramsall);
}

teiconvert.removeRelation = function (n) {
    n = Number(n);
    teiconvert.praat.relations[n] = null;
    teiconvert.displayRelation();
    var paramsall = JSON.stringify(teiconvert.praat.relations);
    localStorage.setItem('paramsPraatRelations', paramsall);
};

teiconvert.displayRelation = function () {
    $('#praatrules').html('');
    for (var i=0; i < teiconvert.praat.relations.length; i++) {
        if (!teiconvert.praat.relations[i]) continue;
        $('#praatrules').append('<p><span class="praatcommand">'
            + '<span class="rl">' + teiconvert.praat.relations[i][0] + '</span>'
            + '<span class="rm">' + teiconvert.praat.relations[i][1] + '</span>'
            + '<span class="rd">' + teiconvert.praat.relations[i][2] + '</span>'
            + '</span> <input type="button" value="Supprimer la relation" onclick="teiconvert.removeRelation(' + i + ');"/></p>');
    }
};

teiconvert.skipTextgridOptions = function() {
    var val = $('input:checkbox[name=praatskip]').prop('checked');
    if (val)
        teiconvert.praat.skip = true;
    else
        teiconvert.praat.skip = false;
};

teiconvert.allowTextgridOptions = function() {
    var val = $('input:checkbox[name=praatoptions]').prop('checked');
    if (val)
        teiconvert.praat.allow = true;
    else
        teiconvert.praat.allow = false;
    teiconvert.setOptions();
};

teiconvert.computeParams = function() {
    var c = '-d ', i;
    for (i=0; i<teiconvert.praat.relations.length; i++) {
        if (!teiconvert.praat.relations[i]) continue;
        c += ' -t ' + teiconvert.praat.relations[i][0] + ' ' + teiconvert.praat.relations[i][1] + ' ' + teiconvert.praat.relations[i][2] + ' ';
    }
    return c;
};

teiconvert.actionTextGrid = function() {
    document.body.style.cursor = 'progress';
    $('#resultinfo').text('En cours de traitement...').css('background','#FF0');
    teiconvert.allowTextgridOptions();
    teiconvert.praat.params = teiconvert.computeParams();
    // alert("actionTextGrid " + teiconvert.praat.params);
    system.call.textgridToTei(teiconvert.praat.fname, teiconvert.praat.teiname, teiconvert.praat.datafrom, teiconvert.praat.params, teiconvert.praat.callback);
};

teiconvert.resetTextGrid = function () {
    teiconvert.praat.relations = [];
    var paramsall = JSON.stringify(teiconvert.praat.relations);
    localStorage.setItem('paramsPraatRelations', paramsall);
    $('#praatrules').html('');
}
