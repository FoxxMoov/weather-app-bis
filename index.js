const API_KEY = "b98445b7b3378028a9235104d45741b0";

$.getJSON("cities-fr.json", function ({ cities }) {
  for (i in cities) {
    $("#select").append(
      $("<option>", {
        value: cities[i].name,
        text: cities[i].name,
      })
    );
  }
});

//API call
const getWeather = async () => {
  var e = document.getElementById("select");
  var value = e.options[e.selectedIndex].text;
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${API_KEY}&units=metric&lang=fr`
  );
  const data = await response.json();
  console.log(data);
  if (!data || data.cod == 400) {
    $("#contrainerResult").addClass("hidden");
  } else {
    $("#contrainerResult").removeClass("hidden");
    $("#loader").addClass("hidden");
    $("#cityName").text(`${data.city.name}, ${data.city.country}`);
    const localtime = dayjs(data.list[0].dt_txt).format("dddd HH:mm");
    $("#localtime").text(`${localtime}`);
    $("#icon").attr(
      "src",
      `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`
    );
    $("#temperature").text(`${data.list[0].main.temp}`);
    $("#feellike").text(`Ressentit : ${data.list[0].main.feels_like} °C`);
    $("#humidity").text(`Humidité : ${data.list[0].main.humidity} %`);
    $("#wind").text(`Vent : ${Math.ceil(data.list[0].wind.speed * 3.6)} km/h`);
    $("#map").attr(
      "src",
      `https://www.google.com/maps/embed/v1/place?key=AIzaSyCojgQWwAeCIFNq95eePsAWEv0NJjNpCcQ&q=${data.city.coord.lat},${data.city.coord.lon}`
    );

    for (j in data.list) {
      const localtime = dayjs(data.list[j].dt_txt).format("ddd. HH:mm");
      const container = $(
        "<div class='flex-col items-center justify-center p-2 xl:w-24 inline-block'>"
      );
      const time = $("<p>", {
        text: localtime,
      });
      const icon = $("<img>", {
        src: `http://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png`,
        className: "w-12 h-12 m-auto",
      });
      const tempContainer = $(
        '<div class="flex items-center justify-between w-full">'
      );
      const maxTemp = $("<p>", {
        text: `${Math.ceil(data.list[j].main.temp_max)}°`,
        className: "text-xs text-gray-600",
      });
      const minTemp = $("<p>", {
        text: `${Math.ceil(data.list[j].main.temp_min)}°`,
        className: "text-xs text-gray-500",
      });

      $("#forecast").append(
        container.append(time, icon, tempContainer.append(maxTemp, minTemp))
      );
    }
  }
};
