// Map VOD origin server to VOD objects
// @param originData - the data retrieved from the VOD source server
// @return the resulting object.
exports.mapMovies = function(originData) {
    var result = {};

    var list = [];
    originData.data.forEach(element => {
        console.debug(element);
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