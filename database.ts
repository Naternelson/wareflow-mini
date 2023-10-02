const sqlite3 = require("sqlite3").verbose();

// Create a new database instance:
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
	db.run("CREATE TABLE user (id INT, name TEXT)");

	const stmt = db.prepare("INSERT INTO user VALUES (?, ?)");
	stmt.run(1, "John Doe");
	stmt.finalize();

	db.each("SELECT id, name FROM user", (err, row) => {
		console.log(row.id + ": " + row.name);
	});
});

// Close the database connection:
db.close();
