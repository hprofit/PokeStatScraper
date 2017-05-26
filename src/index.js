/*
 For each pokemon (assuming HTML is generated already):

 1. Open / make new copy of char sheet
 2. Step through HTML copying:

 a.  Name -> Sheet 1 A 2
 b. Image -> Image URL, presumably  Sheet 1 J, K 2
 c. Species -> Sheet 2  J,K,L 1
 d. Gender -> Sheet 2  J,K,L 2
 e. Nickname -> Sheet  2 B,C 1
 f. Level -> Sheet 2   B,C 2

 g. Attacks -> Sheet 2 A17 thru 22
 h. Skills -- formula is:   x d 6 + y, y-> Modifier column, x-> Value column
 Skill name -> Value cell, Modifier cell
 All Sheet 1
 i.  Acro (Acrobatics) -> D,E 13, B 13
 ii. Athl (Athletics) -> D,E 14, B 14
 iii.  Combat -> D, E 16, B 16
 iv. Stealth -> D, E 28, B 28
 v. Percep (Perception) -> D, E 27, B 27
 vi. Focus -> D, E 23, B 23

 i.  Abilities ->  Sheet 2 H, I 37 thru 49
 j.  Nature -> Sheet 2 B, C 3
 */

// http://www.ptu.panda-games.net/
import $ from '../node_modules/jquery/dist/jquery.min.js';


let StripBoldTags = function (string) {
    return string.replace('<b>', '').replace('</b>', '');
};

let ScrapeInfoTable = function (id) {
    let tableRows = $('#' + id).find('#info_table').find('tbody').children('tr');
    let name = tableRows[0].cells[0].innerHTML.split(' ')[2];
    let imageUrl = tableRows[1].cells[0].children[0].src;
    let level = tableRows[2].cells[0].innerHTML.split(' ')[1];
    let gender = tableRows[3].cells[0].innerHTML.split(' ')[1];

    let natureItems = tableRows[6].cells[0].innerHTML.split(' ');
    let nature = `${natureItems[1]} ${StripBoldTags(natureItems[2])} ${StripBoldTags(natureItems[3])}`;

    let skillsItems = tableRows[10].cells[0].innerHTML.split(' ');
    let skills = {
        [skillsItems[1]]: skillsItems[2].replace(',', ''),
        [skillsItems[3]]: skillsItems[4].replace(',', ''),
        [skillsItems[5]]: skillsItems[6].replace(',', ''),
        [skillsItems[7]]: skillsItems[8].replace(',', ''),
        [skillsItems[9]]: skillsItems[10].replace(',', ''),
        [skillsItems[11]]: skillsItems[12].replace(',', '')
    };

    return {
        name, imageUrl, level, gender, nature, skills
    };
};

let ScrapeAbilitiesTable = function (id) {
    let tableRows = $('#' + id).find('#abilites_table').find('tbody').children('tr').children("[colspan='2']");
    let abilities = tableRows.toArray()
        .slice(1)
        .reduce(
            (acc, val, index) => {
                if (index % 3 === 0) {
                    acc.push(val.innerHTML);
                }
                return acc;
            },
            []
        );

    return {abilities};
};

let ScrapeMovesTable = function (id) {
    let tableRows = $('#' + id).find('#moves_table').find('tbody').children('tr').children("[colspan='2']");
    let moves = tableRows.toArray()
        .slice(1)
        .reduce(
            (acc, val, index) => {
                if (index % 2 === 0) {
                    acc.push(val.innerHTML);
                }
                return acc;
            },
            []
        );

    return {moves};
};


export default ScrapePageForPokemon = function () {
    let pokemonTables = $('.pokemon');
    let pokemonTablesDict = {};

    let arrayOfIds = [];
    let currentId = 0;
    for (let table of pokemonTables) {
        let id = 'pokemon_' + currentId++;
        arrayOfIds.push(id);
        table.id = id;
    }

    for (let id of arrayOfIds) {
        let pokeStatObj = {};
        Object.assign(pokeStatObj, ScrapeInfoTable(id));
        Object.assign(pokeStatObj, ScrapeAbilitiesTable(id));
        Object.assign(pokeStatObj, ScrapeMovesTable(id));

        console.log(pokeStatObj);
    }
};

