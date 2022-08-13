let search_bar = document.querySelector('.searchbar');

let token = localStorage.getItem('token');

let logout = document.querySelector('.logout');

logout.onclick = function(){
    window.location.href = "/";
}

const db = new Map();

const arr=[];

const searchbtn = document.querySelector('.searchbtn');

axios.post(`/home`,null,{                       //send post request to get all data for all users
    headers : {
        authorization : token 
    }

    //if response is positive

}).then((response)=>{

    //if status is ok

    if(response.status == 200){
        window.localStorage.setItem('token',response.headers.authorization);    //set new token in localstorage

        for(let i=0;i<response.data.length;i++){            //create dp map and array to store for table and searching
            let name = response.data[i].name;
            let id = response.data[i].Id;
            db.set(name,id);
            arr.push(`${name} (${id})`);
        }

        for(let i of arr){
            let opt = document.createElement('option');         //iterate through arr to store options in select box to facilitate searching using select2
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
            cell1.innerHTML = key;                              //add the table elements
            cell2.innerHTML = value;
            let but = document.createElement('button');
            but.innerText = "Go!!";
            but.onclick = function(){
                window.location.href = `/user/${value}`;            //add the Go!! button to facilitate movement to user pages
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
                window.location.href = `/user/${gotoid}`;                   //add the Go!! button on the searchbar 
            }
            else{
                alert('choose a user to go to');                //if go is clicked without choosing option
            }
        }
    }

    //for status issur throw user back to home page

    else{
        window.location.href='/?text=statusissue';
    }

    //if response is negative throw user back to home page

}).catch((err)=>{
    console.log(err);
    window.location.href = '/?text=unauthorised'
})




