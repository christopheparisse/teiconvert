/**
 * exportxlsx.js
 */

/* global XLSX */

if (typeof window === 'undefined') {
	var teiExportXlsx = exports;
} else
	var teiExportXlsx = {};

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

teiExportXlsx.teiToCsv = function(teiname, datafrom) {
	var format = $('input:radio[name=paramxlsx]:checked').val();
	var digits = $('#digitsxlsx').val();
	if (!digits || digits<0 || digits>15) digits = 0;
	var parser = new DOMParser();
	var xml = parser.parseFromString(datafrom, "text/xml");
    trjs.template.readMediaInfo(xml);
	var corpus = trjs.dataload.loadTEI(xml);
	var s = teiExportXlsx.tableToCsv(teiname, corpus, digits, format);
	return s;
}

teiExportXlsx.tableToCsv = function(teiname, corpus, digits, format) {
    var data = tableToData(teiname, corpus, digits, format);

    var s = '';
    for (var i=0; i < data.length; i++) {
        var row = data[i];
        for (var j=0; j < row.length-1; j++)
            s += row[j] + '\t';
        s += row[j] + '\n';
    }
	return s;
}

teiExportXlsx.teiToXlsx = function(teiname, datafrom) {
	var format = $('input:radio[name=paramxlsx]:checked').val();
	var digits = $('#digitsxlsx').val();
	if (!digits || digits<0 || digits>15) digits = 0;
	var parser = new DOMParser();
	var xml = parser.parseFromString(datafrom, "text/xml");
    trjs.template.readMediaInfo(xml);
	var corpus = trjs.dataload.loadTEI(xml);
	var s = teiExportXlsx.tableToXlsx(teiname, corpus, digits, format);
	return s;
}

var tableToData = function(teiname, corpus, digits, format) {
	// creates a table with the transcription
	// or try to simulate how generateArray works (what are the ranges)
	//
	// var theTable = document.getElementById(id); // id is a table
	// var oo = generateArray(theTable);
	// var ranges = oo[1];
	//
	if (!digits || digits<0 || digits>15) digits = 5;
	var ajout = $('input:radio[name=ajoutsuppr]:checked').val();
	var nomloc = $('#ajoutsupprname').val();
    var nameList = [];
	if (nomloc != '') {
		if (ajout === 'ajout') {
			var re = /\s+/;
			nameList = nomloc.split(re);
		} else if (ajout === 'suppr') {
			var re = /\s+/;
			nameList = nomloc.split(re);
		}
	}

	// original data
	// var data = oo[0];
	var data = [];
	var nb = 0;
	var who, ts, te, seconds;
    var medianame = 'undefined';
    if (trjs.data.media && trjs.data.media.length > 0) {
        if (trjs.data.media[0].loc && trjs.data.media[0].loc !== '.')
            medianame = trjs.data.media[0].loc + '/' + trjs.data.media[0].name;
        else
            medianame = trjs.data.media[0].name;
    }
    
    var lineOpened = false;
    var divInfo = '';
    var lastTiers = '';
    var row = [];
    var inLoc = true;
	for (var i=0; i<corpus.length; i++) {
		// corpus : arrayof {loc: loc, ts: ts, te: te, tx: tx, type: ('loc' or 'prop')}
		if (nameList.length > 0) {
            if (corpus[i].type === 'loc') {
                if (ajout === 'ajout' && nameList.indexOf(corpus[i].loc.trim()) < 0) {
                    inLoc = false;
                    continue;
                }
                if (ajout === 'suppr' && nameList.indexOf(corpus[i].loc.trim()) >= 0) {
                    inLoc = false;
                    continue;
                }
                inLoc = true;
            } else {
                if (inLoc === false) continue;
                if (ajout === 'ajout' && nameList.indexOf(corpus[i].loc.trim()) < 0) {
                    continue;
                }
                if (ajout === 'suppr' && nameList.indexOf(corpus[i].loc.trim()) >= 0) {
                    continue;
                }
            }
		}
		if (corpus[i].type === 'loc')
			nb++;
        if (corpus[i].ts !== '') {
            ts = teiConvertTools.precision(corpus[i].ts, digits);
            seconds = Math.ceil(ts);
        } else {
            ts = '';
            seconds = '';
        }
		if (corpus[i].type === 'div')
            divInfo = nolines((trjs.dataload.checkstring(corpus[i].tx) + ' | ' + trjs.dataload.checkstring(corpus[i].stx)).trim());
		if (corpus[i].type === 'loc') {
            if (format.indexOf(';aligned;') >= 0) {
                if (lineOpened === true)
        			data.push(row);
                var sx = nolines(corpus[i].tx.trim());
                var sxx = teiConvertTools.cleanChat(sx).trim();
                var spxx = sxx.split(/\s+/);
                var nsxx = spxx.length;
                if (nsxx > 0 && ".!?+".indexOf(spxx[nsxx-1].substr(0,1)) >= 0) nsxx--;
                row = [ medianame, seconds, teiname, divInfo, corpus[i].loc, ts,
                    (corpus[i].te !== '') ? teiConvertTools.precision(corpus[i].te, digits) : '',
                    sx, sxx, nsxx];
                lineOpened = true;
            } else {
                row = [ medianame, seconds, teiname, divInfo, corpus[i].loc, ts,
                    (corpus[i].te !== '') ? teiConvertTools.precision(corpus[i].te, digits) : '',
                    nolines(corpus[i].tx.trim())];
                data.push(row);
            }
		} else {
            if (format.indexOf(';aligned;') >= 0) {
                row.push(corpus[i].loc);
                row.push(nolines(corpus[i].tx.trim()));
            } else {
                if (format.indexOf(';independent;') >= 0) {
                    if (lastTiers === corpus[i].loc) {
                        row.push(corpus[i].loc);
                        row.push(nolines(corpus[i].tx.trim()));
                    } else {
                        if (lineOpened === true)
                            data.push(row);
                        row = [ medianame, seconds, teiname, divInfo, corpus[i].loc, ts,
                            (corpus[i].te !== '') ? teiConvertTools.precision(corpus[i].te, digits) : '',
                            nolines(corpus[i].tx.trim())];
                        lineOpened = true;
                    }
                } else {
                    row = [ medianame, seconds, teiname, divInfo, corpus[i].loc, ts,
                        (corpus[i].te !== '') ? teiConvertTools.precision(corpus[i].te, digits) : '',
                        nolines(corpus[i].tx.trim())];
                    data.push(row);
                }
            }
        }
        lastTiers = corpus[i].loc;
	}
    if (lineOpened === true)
        data.push(row);
    return data;
}

teiExportXlsx.tableToXlsx = function(teiname, corpus, digits, format) {
    var data = tableToData(teiname, corpus, digits, format);

	var ranges = [];
	var ws_name = "TEI_CORPO"; // finds a better name
	// console.log(data);

	var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

	// add ranges to worksheet
	ws['!merges'] = ranges;

	// add worksheet to workbook
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;

	var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

	return new Blob([s2ab(wbout)],{type:"application/octet-stream"});
}

/*
teiExportXlsx.teiToXlsx = function(datafrom) {
	var parser = new DOMParser();
    var xml = parser.parseFromString(datafrom, "text/xml");
    teiTimeline.loadTimeline(xml);
    // creates a table with the transcription
    // or try to simulate how generateArray works (what are the ranges)
    //
    // var theTable = document.getElementById(id); // id is a table
    // var oo = generateArray(theTable);
    // var ranges = oo[1];
    //

    // original data
    // var data = oo[0];
    var data = [];
    var who, ts, te, row;
    var utt = $(xml).find('annotationBlock');
	if (utt.length < 1)
        utt = $(xml).find('annotationGrp');
	if (utt.length < 1)
        utt = $(xml).find('annotatedU');
    if (utt.length < 1) {
        utt = $(xml).find('u');
        for (var i=0; i < utt.length ; i++) {
            who = $(utt[i]).attr('who');
            if (!who) who = '';
            ts = $(utt[i]).attr('start');
            if (!ts)
                ts = '';
            else
                ts = teiTimeline.timelineRef(ts);
            te = $(utt[i]).attr('end');
            if (!ts)
                te = '';
            else
                te = teiTimeline.timelineRef(te);
            row = [ who.trim(), ts, te, nolines($(utt[i]).text().trim()) ];
            data.push(row);
        }
    } else {
        for (var i=0; i < utt.length ; i++) {
            who = $(utt[i]).attr('who');
            if (!who) who = '';
            ts = $(utt[i]).attr('start');
            if (!ts)
                ts = '';
            else
                ts = teiTimeline.timelineRef(ts);
            te = $(utt[i]).attr('end');
            if (!ts)
                te = '';
            else
                te = teiTimeline.timelineRef(te);
            row = [ who.trim(), ts, te, nolines($(utt[i]).find('u').text().trim()) ];
            var spanGrp = $(utt[i]).find('spanGrp');
            for (var sg = 0; sg < spanGrp.length ; sg++) {
                var span = $(spanGrp[sg]).find('span');
                for (var sp=0; sp < span.length; sp++) {
                    var what = $(span[sp]).attr('type');
                    if (!what) what = '';
                    ts = $(span[sp]).attr('start');
                    if (!ts)
                        ts = '';
                    else
                        ts = teiTimeline.timelineRef(ts);
                    te = $(span[sp]).attr('end');
                    if (!te)
                        te = '';
                    else
                        te = teiTimeline.timelineRef(te);
                    row.push(what.trim());
                    row.push(nolines($(utt[i]).find('u').text().trim()));
                }
            }
            data.push(row);
        }
    }

    var ranges = [];
    var ws_name = "TEI_CORPO"; // finds a better name
    // console.log(data);

    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

    // add ranges to worksheet
    ws['!merges'] = ranges;

    // add worksheet to workbook
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

    return new Blob([s2ab(wbout)],{type:"application/octet-stream"});
}
*/
