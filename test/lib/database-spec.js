var Database = require('../../app/lib/database.js');

describe('lib/database', function() {
  var db;

  beforeEach(function() {
    db = new Database();
  });

  afterEach(function() {
    sinon.restore();
  });
  
  describe('connect', function() {
    it('throws if no database is passed', function() {
      expect(function() {
        db.connect();
      }).to.throw
    });

    it('connects to the database passed', function() {
      sinon.stub(db.orm, 'connect');

      var db_name = 'test-bot';

      db.connect(db_name);

      expect(db.orm.connect.args[0][0]).to.equal('sqlite://db/' + db_name + '.db');
    });
  });
});
