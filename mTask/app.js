
//CLock

const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');

const month = document.querySelector('.month');
const day = document.querySelector('.day');
const year = document.querySelector('.year');

function setDate() {
	const now = new Date();
	const mm = now.getMonth();
	const dd = now.getDate();
	const yyyy = now.getFullYear();
	const secs = now.getSeconds();
	const mins = now.getMinutes();
	const hrs = now.getHours();
	const monthName = [
		'January','February','March','April',
		'May','June','July','August','September',
		'October','November','December'
	];
	
	if (hrs > 12) {
		hours.innerHTML = hrs - 12;
	} else {
		hours.innerHTML = hrs;
	}
	
	if (secs < 10) {
		seconds.innerHTML = '0' + secs;
	} else {
		seconds.innerHTML = secs;
	}
	
	if (mins < 10) {
		minutes.innerHTML = '0' + mins;
	} else {
		minutes.innerHTML = mins;
	}
	
	month.innerHTML = monthName[mm];
	day.innerHTML = dd;
	year.innerHTML = yyyy;
}

setInterval(setDate,1000);

////////////////////////////////////////////INPUT

// Create close button
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

// Close on click
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {

    close[i].onclick = function() {

        var div = this.parentElement;
        div.style.display = "none";

    }
}



// Add check class
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
        // Send to completed list

        document.getElementById("myReady").appendChild(ev.target);
          
        // Run percentage
        percentage();

    }
}, false);



// Create new list item using enter key
document.getElementById("taskInput").addEventListener("keyup", function newElement(event) {
    
    if (event.keyCode === 13) {      ////////////////////// prosoxi sto electron
        event.preventDefault();
        var li = document.createElement("li");
        var inputValue = document.getElementById("taskInput").value;
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        if (inputValue === '') {
            // document.getElementById('taskInput').style.color = "red";

        } else {
            document.getElementById("myUL").appendChild(li);

            percentage();
        }
        document.getElementById("taskInput").value = "";

        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);


        for (i = 0; i < close.length; i++) {
            close[i].onclick = function() {
                var div = this.parentElement;
                div.style.display = "none";
                div.className = "closed";

                // percentage();
                percentage();
                
            }
        }
    }
});

function percentage() {
    const progress = document.querySelector('.progress-done');
    let output = document.getElementById('number');
    let lisIn = document.getElementById("myUL").getElementsByTagName("LI");
    let lisReady = document.getElementById("myReady").getElementsByTagName("LI");
    let closed1 = document.getElementById("myReady").getElementsByClassName("closed");
    let closed2 = document.getElementsByClassName("closed");
    let paronomastis = lisIn.length + lisReady.length - closed2.length;
    let arithmitis = lisReady.length - closed1.length;
    var final = parseInt((arithmitis / paronomastis) * 100);

    document.getElementById("tasksRemaining").innerHTML = paronomastis - arithmitis;
    document.getElementById("tasksCompleted").innerHTML = arithmitis;
    document.getElementById("total").innerHTML = arithmitis + (paronomastis - arithmitis) ;

    if (arithmitis == 0 && paronomastis == 0) {
        final = 0;
        output.innerHTML = `${final}%`;  

        progress.setAttribute('data-done', final);
        progress.style.width = progress.getAttribute('data-done') + '%';
        progress.style.opacity = 1;

    } else if (arithmitis < 0) {
        arithmitis = 0;
        var final = parseInt((arithmitis / paronomastis) * 100);

        progress.setAttribute('data-done', final);
        progress.style.width = progress.getAttribute('data-done') + '%';
        progress.style.opacity = 1;

    } else {
        var final = parseInt((arithmitis / paronomastis) * 100);
        output.innerHTML = `${final}%`;
       
        progress.setAttribute('data-done', final);
        progress.style.width = progress.getAttribute('data-done') + '%';
        progress.style.opacity = 1;
    }
}

