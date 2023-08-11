let app;
let testaudio;
window.onload = _ => {
    testaudio = document.querySelector("#testaudio");
    app = new Vue({
        el: '#app',
        data: {
            title: "Kurtame",
            songs: {},
            keys: [],
            name: "",
            url: "",
            files: [],
            status: "Confirm"
        },
        methods: {
            dataLoaded(e){
                //let s = e.target.result;
                //let view = new Uint8Array(s);
                //console.log(s);
                //console.log(view);
                let cs = e.target.result;
                cs = cs.replace(/\r?\n|\r/g, '');
                cs = cs.replace(/[^\w\ \-{},.+\][:;_/\\"]/gi, '')
                //for (var x = 0; x < view.length; x++){
                    //console.log(view[x]);
                    //console.log(parseInt(s[x], 16).toString(10));
                //    cs += String.fromCharCode(view[x]);
                //}
                console.log(cs);
                let data = JSON.parse(cs);
                //Clear old values
                this.keys = data.keys;
                this.songs = data.songs;
                this.status = "Confirm";
                // 1- create an array of words from the loaded string
                /*let filewords = s.split("::");
            
                for(let i = 0; i< filewords.length; i+=2)
                {
                    if(!this.songs[filewords[i]])
                    {
                        this.keys.push(filewords[i]);
                        this.songs[filewords[i]] = [];
                        this.songs[filewords[i]].push(filewords[i+1]);
                    }
                    else
                    {
                        this.songs[filewords[i]].push(filewords[i+1]);
                    }
                }*/
                //displaySet();
                //testaudio.src = this.songs[this.keys[0]][0].file;
                //testaudio.play();
            },
            removeElement(e){
                let headerParent = e.target.parentElement.parentElement.previousElementSibling;
                let listParent = e.target.parentElement.parentElement;
                let listNode = e.target.parentElement;
                let count = 0;
                for(let i = 0; i < listParent.children.length; i++)
                {
                    if(listParent.children[i] == listNode)
                    {
                        count = i;
                        break;
                    }   
                }
                let key = headerParent.innerHTML;
                this.songs[key].splice(count, 1);
                if(this.songs[key].length == 0)
                {
                    this.songs[key] = null;
                    this.keys.splice(this.keys.indexOf(key), 1);
                    this.$forceUpdate();
                }
                else
                {
                    this.$forceUpdate();
                }
            },
            showRemove(e){
                if(e.target.querySelector("button.removeButton"))
                    e.target.querySelector("button.removeButton").style.visibility = "visible";
            },
            hideRemove(e){
                if(e.target.querySelector("button.removeButton"))
                    e.target.querySelector("button.removeButton").style.visibility = "hidden";
            },
            /*onDragenter(e){
                e.stopPropagation();
                e.preventDefault();
                e.target.classList.add("hover");
              },
            onDragover(e){
                e.stopPropagation();
                e.preventDefault();
              },*/
            onStartUpload(e){
                //e.stopPropagation();
                //e.preventDefault();
                //e.target.classList.remove("hover");
                let file = e.target.files[0];
                this.status = "Wait..."
                if(file){
                  let reader = new FileReader();
                  reader.onload = this.dataLoaded;
                  reader.readAsText(file);
                }
            },
            async confirmClicked(){
                if(this.name && this.files.length > 0 && this.status == "Confirm")
                {
                    this.status = "Wait..."
                    let finished = [];
                    for(let i = 0; i < this.files.length; i++)
                    {
                        finished.push(this.addSong(this.files[i]));
                    }
                    console.log(finished);
                    await finished[finished.length - 1];
                    this.files = [];
                    document.querySelector("#fileUpload").value = "";
                    this.status = "Confirm";
                }
            },
            async addSong(file) {
                let freader = new FileReader();
                let finished = false;

                freader.onload = function(e) {
                    //console.log(e.target.result);
                    if(app.keys.includes(app.name))
                    {
                        app.songs[app.name].push({name: file.name, file: e.target.result});
                    }
                    else
                    {
                        app.keys.push(app.name);
                        app.songs[app.name] = [];
                        app.songs[app.name].push({name: file.name, file: e.target.result});
                    }
                    app.$forceUpdate();
                    finished = true;
                };
            
                let cutter = new mp3cutter();
                cutter.cut(file, 0, 15, (blob) => {
                    console.log("File cut");
                    freader.readAsDataURL(blob);
                });

                return new Promise(resolve => {
                    waitForIt();
                    function waitForIt() {
                        if(finished)
                        {
                            resolve();
                        }
                        else
                        setTimeout(() => {
                            waitForIt();
                        }, 100);
                    }

                  });
                //freader.readAsDataURL(file);
            },
            exportClicked(){
                let data = {
                    keys: this.keys,
                    songs: this.songs
                }
                let json = JSON.stringify(data);
                var byteArray = new Uint8Array(json.length/*/2*/);
                for (var x = 0; x < byteArray.length; x++){
                    byteArray[x] = json[x].charCodeAt(0);
                }
                console.log(byteArray);
                var blob = new Blob([byteArray], {type: "application/octet-stream"});
                //let blob = new Blob([json], {type: "text/plain;charset=utf-8" });
                saveAs(blob, "anime-kurta.kurtame");
            },
            onUpload(e)
            {
                this.files = e.target.files;
                //this.playFile(this.files[0]);
            },
            playFile(file) {
                var freader = new FileReader();
            
                freader.onload = function(e) {
                    testaudio.src = e.target.result;
                    //console.log(e.target.result);
                    testaudio.play();
                };
            
                freader.readAsDataURL(file);
            }
        },
        computed: {
            count(){
                return this.keys.length;
            }
        }
    });


    /*dropbox = document.querySelector("#dropbox");
    dropbox.ondragenter = onDragenter;
    dropbox.ondragover = onDragover;
    dropbox.ondrop = onDrop;

    count = document.querySelector("#count");*/

    /*document.querySelector("#confirm").onclick = e => {
        let name = document.querySelector("#anime-name").value;
        let url = document.querySelector("#url").value;
        name = name.trim();
        url = url.trim();
        if(name && url)
        {
            app.addSong(name, url);
            document.querySelector("#url").value = "";
        }
    }*/

    /*exportButton = document.querySelector("#export");
    exportButton.onclick = e => {
        let data = encodeSongs();
        console.log(data);
        let blob = new Blob([data], {type: "text/plain;charset=utf-8" });
        saveAs(blob, "anime-kurta.txt");
    }*/
}

/*function addSong(name, url)
{
    if(keys.includes(name))
    {
        songs[name].push(url);
    }
    else
    {
        keys.push(name);
        songs[name] = [];
        songs[name].push(url);
    }
    displaySet();
}

function displaySet() {
    for(let i = 0; i < keys.length; i++)
    {
        let nameEle = document.querySelector("h3#" + removeSpace(keys[i]));
        if(nameEle)
        {
            if(songs[keys[i]].length != nameEle.nextElementSibling.childElementCount)
            {
                for(let j = nameEle.nextElementSibling.childElementCount; j < songs[keys[i]].length; j++)
                {
                    nameEle.nextElementSibling.appendChild(createAniLink(songs[keys[i]][j]));
                }
            }
        }
        else {
            let newNameEle = document.createElement("h3");
            newNameEle.id = removeSpace(keys[i]);
            newNameEle.innerHTML = keys[i];
            document.querySelector("#set").appendChild(newNameEle);
            newNameEle.insertAdjacentElement("afterend", document.createElement("ul"))
            for(let j = 0; j < songs[keys[i]].length; j++)
            {
                newNameEle.nextElementSibling.appendChild(createAniLink(songs[keys[i]][j]));
            }
        }
    }
    count.innerHTML = "Count: " + keys.length;
}

function createAniLink(linkTxt)
{
    let newEle = document.createElement("li");
    let link = document.createElement("a");
    link.innerHTML = linkTxt;
    link.href = linkTxt;
    link.target = "_blank";
    link.className = "ani-link";
    let removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove";
    removeButton.className = "removeButton";
    removeButton.onclick = removeElement;
    newEle.appendChild(link);
    newEle.appendChild(removeButton);
    newEle.onmouseenter = showRemove;
    newEle.onmouseleave = hideRemove;
    return newEle;
}

function onDragenter(e){
    e.stopPropagation();
    e.preventDefault();
    e.target.classList.add("hover");
  }
  
  function onDragover(e){
    e.stopPropagation();
    e.preventDefault();
  }
  
  function onDrop(e){
    e.stopPropagation();
    e.preventDefault();
    e.target.classList.remove("hover");
    let file = e.dataTransfer.files[0];
    if(file){
      let reader = new FileReader();
      reader.onload = app.dataLoaded;
      reader.readAsText(file);
    }
  }

  function dataLoaded(e){
    let s = e.target.result;
    //Clear old values
    keys = [];
    songs = {};

    // 1- create an array of words from the loaded string
    let filewords = s.split("::");

    for(let i = 0; i< filewords.length; i+=2)
    {
        if(!songs[filewords[i]])
        {
            keys.push(filewords[i]);
            songs[filewords[i]] = [];
            songs[filewords[i]].push(filewords[i+1]);
        }
        else
        {
            songs[filewords[i]].push(filewords[i+1]);
        }
    }
    displaySet();
}

function getIdFromURL(url)
{
    let id = url.substring(url.indexOf("v=") + 2);
    return id;
}

function removeSpace(str)
{
    return str.split(" ").join("");
}

function encodeSongs()
{
    let s = "";
    for(let i = 0; i < keys.length; i++){
        for(let j = 0; j < songs[keys[i]].length; j++)
        {
            s += keys[i];
            s += "::";
            s += songs[keys[i]][j];
            s += "::";
        }
    }
    console.log(s);
    let arr = s.split("");
    arr[s.length - 1] = "";
    arr[s.length - 2] = "";
    s = arr.join("");
    return s;
}

function removeElement(e){
    console.log("removing: " + e.target);
    let headerParent = e.target.parentElement.parentElement.previousElementSibling;
    let listParent = e.target.parentElement.parentElement;
    let listNode = e.target.parentElement;
    let count = 0;
    for(let i = 0; i < listParent.children.length; i++)
    {
        if(listParent.children[i] == listNode)
        {
            count = i;
            break;
        }   
    }
    let key = headerParent.innerHTML;
    console.log(key);
    songs[key].splice(count, 1);
    if(songs[key].length == 0)
    {
        headerParent.remove();
        listParent.remove();
        songs[key] = null;
        keys.splice(keys.indexOf(key), 1);
    }
    else
    {
        listNode.remove();
    }
}

function showRemove(e){
    e.target.querySelector("button.removeButton").style.visibility = "visible";
}

function hideRemove(e){
    e.target.querySelector("button.removeButton").style.visibility = "hidden";
}*/