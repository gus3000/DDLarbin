exports.includedRecursively = function (o1, o2) {
    if (typeof o1 === 'object') {
        //console.log('objects : ' + JSON.stringify(o1) + ', ' + JSON.stringify(o2));
        if (o1 === null) { return o2 === null; }
        if (o2 === null) { return false; }
        //console.log('objects not null');

        var allequal = true;
        Object.keys(o1).forEach(function (key, index) {
            if (o2[key] == null) {
                allequal = false;
            }
            allequal = allequal && exports.includedRecursively(o1[key],o2[key]);
        })

        return allequal;
    }
    if (o1 === o2) { return true; }
    return false;
}

// console.log(exports.includedRecursively(3, 3));
// console.log(exports.includedRecursively(3, 4));
// console.log(exports.includedRecursively({ 'a': 3 }, { 'a': 3, 'b': 4 }));
// console.log(exports.includedRecursively({ 'a': 3 }, { 'a': 1, 'b': 4 }));
// console.log(exports.includedRecursively({ 'a': 3, 'c': 5 }, { 'a': 3, 'b': 4 }));
// console.log(exports.includedRecursively({ 'a': 3, 'c': { 'c1': '14', 'c2': '15' } }, { 'a': 3, 'b': 4, 'c': { 'c1': '14', 'c2': '15' } }));
// console.log(exports.includedRecursively({ 'a': 3, 'c': { 'c1': '14', 'c2': '15' } }, { 'a': 3, 'b': 4, 'c': { 'c1': '4', 'c2': '15' } }));
