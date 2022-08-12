let search_bar = document.querySelector('.searchbar');

let token = localStorage.getItem('token');

const db = new Map();

const arr=[];

const searchbtn = document.querySelector('.searchbtn');

axios.post(`/home`,null,{
    headers : {
        authorization : token 
    }
}).then((response)=>{
    if(response.status == 200){
        window.localStorage.setItem('token',response.headers.authorization);
        let name = response.data[0].name;
        let id = response.data[0].Id;
        db.set(name,id);
        arr.push(`${name} (${id})`);
        for(let i of arr){
            let opt = document.createElement('option');
            opt.value=i;
            opt.innerText=i;
            search_bar.appendChild(opt);
        }

        $(document).ready(function() {
            $('.searchbar').select2();
        });

        var table = document.getElementById("table_id");
        var header = table.createTHead();
        var row = header.insertRow(0); 
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = "Name";
        cell2.innerHTML = "Roll No";
        cell3.innerHTML = "";
        let j=0;

        db.forEach(function(value, key) {
            var row = table.insertRow(j+1);
            var cell1=row.insertCell(0)
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = key;
            cell2.innerHTML = value;
            let but = document.createElement('button');
            but.innerText = "Go!!";
            but.onclick = function(){
                window.location.href = `/user/${value}`;
            }
            cell3.appendChild(but);
            j++;
        })
        searchbtn.onclick = function(){
            let gotoid = search_bar.options[search_bar.selectedIndex].value;
            if(gotoid!="Search...."){
                gotoid = gotoid.split(")");
                gotoid = gotoid[0];
                gotoid = gotoid.split("(");
                gotoid = gotoid[1];
                window.location.href = `/user/${gotoid}`;
            }
            else{
                alert('choose a user to go to');
            }
        }
    }
    else{
        window.location.href='/?text=statusissue';
    }
}).catch((err)=>{
    console.log(err);
    window.location.href = '/?text=unauthorised'
})




