/* Parse JSON file generated by Ruby code. 
Output random shuffled words*/

const url ='https://raw.githubusercontent.com/ndlopez/jumble_game/main/data/jumble_words.json';

const numWords = 4;

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;
    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a //.join("");
}

function shuffleArray(myArr){
    for (let idx = myArr.length -1;idx > 0;idx--){
        const jdx = Math.floor(Math.random()*(idx + 1));
        [myArr[idx],myArr[jdx]]=[myArr[jdx],myArr[idx]];
    }
    return myArr
}

build_boxes();
document.body.appendChild(addModal())

let counter = 0, allChecked = 0;
function matchLetter(myLetter,myId,kdx,wordLen){
    let newKount=0;

    var thisId = "let" + myId.slice(-2);
    var pressVal = document.getElementById(thisId);
    
    var inputVal = document.getElementById(myId);
    inputVal.addEventListener('keyup',function(event){
        let gotValue = event.key;
        gotValue = gotValue.toUpperCase();
        if(gotValue === myLetter){
            inputVal.classList.remove("wrongAns");
            inputVal.classList.add("correctAns");
            counter += 1;
            pressVal.classList.remove("notPressed");
            pressVal.classList.add("yesPressed");
            //console.log("Correct ans");
        }else{
            if(gotValue === "" || gotValue !== myLetter){
                inputVal.classList.remove("correctAns");
                inputVal.classList.add("wrongAns");
                //console.log("Wrong ans");
            }
        }

        newKount= counter;
        if(newKount == wordLen){
            counter =0;allChecked += 1;
            var auxStr= "word"+String(kdx+1);
            //console.log("all letters are correct",auxStr);
            var getSep = document.getElementById(auxStr);
            getSep.classList.remove("wrongBar");
            getSep.classList.add("correctBar");
            if (allChecked == 4){
                openNav();/*alert("Congratulations");*/}
        }else{console.log("some letters are wrong",newKount);}
        console.log("id",myId,"gotValue",gotValue,"myLet",myLetter);
        //console.log("count",counter,"newK",newKount,wordLen,kdx);
    });
}

async function build_boxes(){
    const data = await get_words();
    let idx=0;
    for(var word of data){
        let jdx=0;
        for(var thisLtr of word){
            thisLtr = thisLtr.toUpperCase();
            var gotId = "letter" + idx + jdx;
            matchLetter(thisLtr,gotId,idx,word.length);
            jdx = jdx + 1;
        }
        idx = idx + 1;
    }
}

async function get_words(){
    const response = await fetch(url);
    const jumbleWords = await response.json();
    const jumble_words = shuffleArray(jumbleWords);
    var usedWords = [];
    var text = "";

    //console.log(jumble_words);
    for (let jdx = 0; jdx < numWords; jdx++) {
        //var randIdx = Math.floor(Math.random()*jumble_words.length);
        var jumble_word = jumble_words[jdx];
        //console.log(randIdx,jumble_word)
        usedWords.push(jumble_word);
        jumble_word = jumble_word.toUpperCase();
        var myShuffleWord = jumble_word.shuffle()
        if( myShuffleWord === jumble_word){
            myShuffleWord = jumble_word.shuffle();
        }
        let divWidth = 34 * jumble_word.length;

        let idx=0;
        var spanArr = [];
        jumble_word.split("").forEach(el => {
            var spanTxt = "<span class='notPressed' id='let" + jdx + idx + "'>"+ el + " </span>";
            //spanLetters += spanText
            spanArr.push(spanTxt);
            idx +=1;
        });
        /*text += "<div class='row' id='shufWord' style='width:" + divWidth + "px;'><h2>" + myShuffleWord + "</h2></div>";*/
        var myWord = shuffleArray(spanArr);
        text += "<div class='row' id='shufWord' style='width:" + divWidth + "px;'><h2>";
        myWord.forEach(el => {text += el;})
        text += "</h2></div>";
        /* Build as many inputs as the length of a word*/
        text += "<div class='row' style='width:"+ divWidth + "px;'>";
        for (let idx = 0; idx < jumble_word.length; idx++) {
            text += "<div class='oneLetterCol'><input class='wrongAns'";
            text += "id='letter"+ jdx + idx+"' maxlength=1></div>";            
        }
        /*text += "<div class='result'></div>"*/
        text += "</div><div class='row separator wrongBar' id=word" + (jdx + 1) + " style='width:" + divWidth + "px;'></div>";
        
        //console.log("word ",jumble_word,jdx);
        document.getElementById("jumble_this_word").innerHTML = text;
    }
    return usedWords;
}

/* open and close modal */
function openNav(){
    document.getElementById("SuccessNav").style.display = "block";
    document.body.style.overflow = "hidden";
}
function closeNav(thisObj){
    document.getElementById(thisObj).style.display = "none";
    document.body.style.overflow = "auto";
}
function addModal(){
    const secDiv = document.createElement("div");
    secDiv.id = "SuccessNav";
    secDiv.className = "success_window";
    secDiv.innerHTML = "<div class='success-content'><div class='success-header'>"+
    "<span class='closeBtn' onclick=\"closeNav('SuccessNav')\">&times;</span>" +
    "</div><div class='success-body'>"+
    "<img class='success-svg' src='static/thumbs-up.svg'/><h2>Success</h2>" +
    "<p>You have solved the puzzle.</p></div></div>";
    window.onclick = function(ev){
        if (ev.target == secDiv){
            secDiv.style.display = "none";
        }
    }
    return secDiv;
}

function idontWork(){
    for (let idx = 0; idx < usedWords.length; idx++) {
        for (let letter of usedWords[idx]){
            letter = letter.toUpperCase();
            let inputVal = document.getElementById(letter);
            inputVal.onkeyup = function(){
                var myVal = inputVal.value;
                if (myVal.toUpperCase() === letter){
                    inputVal.classList.remove("wrongAns");
                    inputVal.classList.add("correctAns");
                    counter += 1;
                }
                else{
                    if(myVal.value === "" || myVal.toUpperCase !== letter){
                        inputVal.classList.remove("correctAns");
                        inputVal.classList.add("wrongAns");
                    }
                }
            }
            //console.log("correct ans",counter);
        }
        //console.log("total letters in ",usedWords[idx],usedWords[idx].length);
    }
}