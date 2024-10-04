// Map VOD origin server to VOD objects
// @param originData - the data retrieved from the VOD source server
// @return the resulting object.
exports.mapMovies = function(originData) {
    var result = {};

    var list = [];
    originData.data.forEach(element => {
        var listItem = {};
        listItem.itemId = element.id_video;
        listItem.title = element.nome_ingles;
        listItem.titlePT = element.nome_video;
        listItem.description = element.descricao_video;
        listItem.year = element.ano;
        listItem.subtitle = element.legenda;
        listItem.actors = element.atores;
        listItem.director = element.diretor;
        listItem.thumbnail = element.foto;

        list.push(listItem);
    });
    result.list = list;

    return result;
}

// Map VOD origin server to VOD object
// @param originData - the data retrieved from the VOD source server
// @return the resulting object.
exports.mapMovie = function(originData) {
    var result = {};

    originData = originData[0];

    result.itemId = originData.id_video;
    result.title = originData.nome_ingles;
    result.titlePT = originData.nome_video;
    result.year = originData.ano;
    result.subtitle = originData.legenda;
    result.IMDB = originData.IMBD;
    result.links = [];

    if(originData.URL != '') result.links.push({'link':originData.URL});
    if(originData.URL2 != '') result.links.push({'link':originData.URL2});
    if(originData.URL3 != '') result.links.push({'link':originData.URL3});
    if(originData.URL4 != '') result.links.push({'link':originData.URL4});
    if(originData.URL5 != '') result.links.push({'link':originData.URL5});

    return result;
}