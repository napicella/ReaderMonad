(function main() {
    var db1 = {
        'reader monad' : '1 - the monad reader is ...',
        'io reader' : '1 - the monad reader is ...',
        'default' : '1 - dependency injection or reader monad, this is the question? ...'
    };

    var db2 = {
        'reader monad' : '2 - the monad reader is ...',
        'io reader' : '2 - the monad reader is ...',
        'default' : '2 - dependency injection or reader monad, this is the question? ...'
    };

    var documentDao = DocumentDao();
    var documentService = DocumentService(documentDao);
    var styleService = StyleService(documentService);
    console.log(styleService.addFooter('reader monad', Math.random() >= 0.5 ? db1 : db2));

})();

function reader(k) {
    return {
        run: function(e) {
            return k(e);
        },
        bind: function(f) {
            return reader(function(e) {
                return f(k(e)).run(e);
            });
        },
        map: function(f) {
            return reader(function(e) {
                return f(k(e));
            });
        }
    };
}

function DocumentDao() {

    return {
        get : function (documentName, db) {
            return db[documentName] == null ? db['default'] : db[documentName];
        }
    }
}

function DocumentService(documentDao) {

    return {
        retrieve : function (documentName, db) {
            return documentDao.get(documentName, db).toUpperCase();
        }
    }
}

function StyleService(documentService) {

    return {
        addFooter : function(documentName, db) {
            var document = documentService.retrieve(documentName, db);
            return document + " \n----------------------------";
        }
    }
}

