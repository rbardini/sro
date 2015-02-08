var _      = require("lodash"),
    moment = require("moment"),
    chalk  = require("chalk"),
    Table  = require("cli-table");

var SYMBOLS = {pass: "✓", fail: "✖"};

var TableFormatter = {
  format: function format(items, failures) {
    var formattedItems = _.reduce(items, function(result, item) {
      var header = "\n " + chalk.bold(item.get("numero")) + "\n " + item.countryName() + " via " + item.service(),
          table  = new Table({
            head: ["Data", "Local", "Situação"]
          });

      item.events().forEach(function(event) {
        var data      = moment(event.date()).format("lll"),
            local     = event.get("local") + " - " + event.get("cidade") + "/" + event.get("uf"),
            descricao = event.get("descricao"),
            destino   = event.get("destino");

        if (destino) {
          local += "\nEm trânsito para " + destino.local + " - " + destino.cidade + "/" + destino.uf;
        }

        table.push([data, local, descricao]);
      });

      return result + header + "\n" + table.toString() + "\n";
    }, "");

    var formattedFailures = _.reduce(failures, function(result, failure) {
      return result + "\n " + chalk.bold(failure.numero) + "\n " + chalk.red(SYMBOLS.fail + " " + failure.error + "\n");
    }, "");

    return formattedItems + formattedFailures;
  }
};

exports = module.exports = TableFormatter;
