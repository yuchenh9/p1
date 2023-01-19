var arraya=[{"a":1,"thing":1},{"b":2,"thing":2}]
var arrayb=[{"thing":"a"},{"thing":"b"},{"thing":"c"}]

function leftJoin(left,right,feild) {
    var array =[];
    for (const i of left){
        var topush = JSON.parse(JSON.stringify(i))
        topush[feild]=right[topush[feild]][feild]
        array.push(topush)
    }

    return array
}
        


        
console.log(leftJoin(arraya,arrayb,"thing"));


