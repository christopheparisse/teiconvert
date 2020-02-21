var arg = require('minimist')(process.argv.slice(2))
// console.log(argv);
var childproc = require('child_process');

for (var a=0; a<arg._.length; a++) {
    var input = arg._[a];
    var output = arg._[a];
    var p = output.indexOf("-original.cha");
    if (p > 0)
        output = output.substring(0,p);
    output = output + '.tei_corpo.xml';
    var cmds = ['-cp', '/devlopt/teicorpo/teicorpo.jar', 'fr.ortolang.teicorpo.ClanToTei', '-i', input, '-o', output];
    var jv = childproc.spawnSync('java', cmds);
    console.log(jv.stdout.toString());
}