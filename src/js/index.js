require('../styles/styles.scss');
require('../index.html');



function tvshow() {
  let getShowID;

  //listen on every type within input field
  this.inputChange = function() {
    document.querySelector("#clear_search").style.display = "none";
    document.querySelector(".search_tvshow .fa-times").classList.remove("hidden");
    document.querySelector("#list_shows").classList.remove("hidden");
    document.querySelector(".search_tvshow .fa-search").classList.add("hidden");


    // implement debounce for taxing work
    const efficientInput = debounce(function() {
      console.log(document.querySelector('input[name="tvshow"]').value);

      //get input field value
      let term = document.querySelector('input[name="tvshow"]').value

      //clear and repopulate query after
      document.getElementById('list_shows').innerHTML = "";

      document.getElementById('selected_tvshow_seasons').innerHTML = "<option>select season</option";

      document.getElementById('episodes_timeline').innerHTML = "";

      //query shows based on value in tvshow input field
      queryShows(term);

    }, 50);

    efficientInput();


  }

  //clear to initial state
  this.clearSearch = function() {
    document.querySelector('input[name="tvshow"]').value = "";
    document.getElementById('list_shows').innerHTML = "";
    document.querySelector("#clear_search").style.display = "block";
    document.querySelector(".search_tvshow .fa-times").classList.add("hidden");
    document.querySelector(".search_tvshow .fa-search").classList.remove("hidden");
    document.querySelector("#list_shows").classList.add("hidden");
    document.querySelector("#single_tvshow_container").classList.add("hidden");

  }

  //handle error message
  this.error = function() {
    console.log("error");
    document.querySelector(".search-container").classList.add("error")
  }

  //on selected tvshow
  this.onSelectShow = function() {
    console.log(this);
    document.querySelector("#single_tvshow_container").classList.remove("hidden");
    // document.querySelector("input[name=tvshow").value = document.querySelector("#single_tvshow_name").innerHTML;
    console.log("select tvshow");
    console.log(this.getAttribute("data-showID"));

    //retrieve ID of selected show
    getShowID = this.getAttribute("data-showID");

    //get selected show
    getSingleShow(getShowID);
  }

  //on selected tv show season
  this.onSelectSeason = function(event) {
    let seasonEpisodeDates = [];

    console.log("select season");
    document.querySelector(".loading").classList.remove("hidden");

    console.log(event);

    //select tag element: season number
    const getShowSeasonNumber_select = document.getElementById("selected_tvshow_seasons");

    //get selected season number value 
    let getShowSeasonNumber_value = getShowSeasonNumber_select.options[getShowSeasonNumber_select.selectedIndex].getAttribute("data-season-number");

    //get ID of the selected show
    getShowID = getShowSeasonNumber_select.options[getShowSeasonNumber_select.selectedIndex].getAttribute("data-showID");

    console.log(getShowSeasonNumber_value);

    //get total episodes count of selected season
    let episodes_count = getShowSeasonNumber_select.options[getShowSeasonNumber_select.selectedIndex].getAttribute("data-total-episodes");

    // implement debounce for taxing work
    const selectEfficient = debounce(function() {
      //loop through each episodes of selected season
      for (var i = 1; i <= episodes_count; i++) {

        //query get each episode number info
        let a = getData(`/shows?id=${getShowID}&seasons=GET&season_number=${getShowSeasonNumber_value}&episode_number=${i}`);
        console.log(a)

        //get the episodes air date and push to array containing all episodes air date of selected season
        seasonEpisodeDates.push(Date.parse(a.airdate));
      }
      console.log(seasonEpisodeDates);
      seasonEpisodeDates.forEach((date, index) => {

        console.log(Math.floor((date - seasonEpisodeDates[0]) / (seasonEpisodeDates[seasonEpisodeDates.length - 1] - seasonEpisodeDates[0]) * 100));

        //reveal timeline after load
        document.querySelector(".loading").classList.add("hidden");
        document.querySelector("#episodes_timeline").classList.remove("hidden");

        //create point in timeline
        const point = document.createElement("div");
        point.classList.add("timeline_points");

        //add class for last element
        if (index === seasonEpisodeDates.length - 1) {
          point.classList.add("timeline_point_last");
        }

        //subtract all parsed air date minus earliest date to start value at ZERO. Set timeline point position by percentage
        point.style.left = Math.floor((date - seasonEpisodeDates[0]) / (seasonEpisodeDates[seasonEpisodeDates.length - 1] - seasonEpisodeDates[0]) * 100) + "%";
        //aappend timeline point to timeline container
        point.innerHTML = `<div class="episode_label">episode ${index+1}</div>`;
        document.getElementById("episodes_timeline").appendChild(point);

      });


    }, 250);

    selectEfficient();
  }
}

// initialize data
tvshow = new tvshow();



const queryShows = (term) => {
  const shows = getData("/search_tvshow?show=" + term);
  // console.log(shows)

  if (shows.length == 0 && term.length != 0) {
    tvshow.error();
  } else {
    document.querySelector(".search-container").classList.remove("error")

  }


  const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  for (let show of shows) {
    const tvshow = show.show;
    const showID = tvshow.id;
    const showName = tvshow.name;
    const premiered = tvshow.premiered ? tvshow.premiered.split("-") : "";
    const premieredMonth = months[parseInt(premiered[1])];
    const premieredDay = premiered[2];
    const premieredYear = premiered[0];
    const rating = tvshow.rating.average ? tvshow.rating.average : "Unknown";

    // console.log(premiered);
    const x = `
          <div class="tvshow_option" data-showID=${showID}>
            <div class="show-detail showname">${showName}</div>
            <div class="show-detail premiered">premiered on ${premieredMonth} ${premieredDay}, ${premieredYear}</div>
            <div class="show-detail rating">Rating: ${rating}</div>
                  
          </div>
        `

    document.getElementById('list_shows').innerHTML = document.getElementById('list_shows').innerHTML + x;
  }
  document.querySelectorAll(".tvshow_option").forEach(show => show.addEventListener("click", tvshow.onSelectShow));
}


const getSingleShow = (id) => {
  const single_show = getData(`/shows?id=${id}`);
  console.log(single_show);

  const y = `
        <div>
          <div class="single_tvshow_name" >${single_show.name}</div>
          <div class="single_tvshow_summary" >${single_show.summary}</div>
        </div>

      `;

  document.getElementById('selected_tvshow').innerHTML = y;
  document.querySelector("#list_shows").classList.add("hidden");
  // tvshow.clearSearch();

  const getSeason = function() {

    const single_show_seasons = getData(`/shows?id=${id}&seasons=GET`);

    single_show_seasons.forEach(season => {

      console.log(season);
      const z = `<option data-total-episodes=${season.episodeOrder} data-showID=${id} data-season-number=${season.number}>Season ${season.number}</option>`;

      const selected_tvshow_seasons = document.getElementById('selected_tvshow_seasons');

      selected_tvshow_seasons.innerHTML = selected_tvshow_seasons.innerHTML + z;
    });

  }

  getSeason();
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function getData(url) {
  const server_root = 'http://localhost:4001';
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `${server_root}${url}`, false);
  xhttp.send();
  return JSON.parse(xhttp.responseText)
}


document.querySelector("input[name=tvshow]").addEventListener("keyup", tvshow.inputChange);
document.getElementById("clear_search").addEventListener("keyup", tvshow.inputChange);
document.querySelectorAll(".clear").forEach(element => element.addEventListener("click", tvshow.clearSearch));
document.querySelector("#selected_tvshow_seasons").addEventListener("change", tvshow.onSelectSeason);