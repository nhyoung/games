# Old Town Road Random Lyric Generator API Documentation
The Old Town Road Random Lyric Generator generates a random line of lyrics from the hit song
"Old Town Road"

## Retrieve Single Lyric
**Request Format:** oldtownroad.php?lyric=linenumber

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Retrieves a single line of lyrics from a collection of the most famous lines by
Lil Nas X in "Old Town Road"

**Example Request:** oldtownroad.php?lyric=line2

**Example Response:**
```
"I got the horses in the back"
```
**Error Handling:**
-If missing the line number, it will 400 error with a helpful message: `Please pass in a line number to lookup or all to generate all lyrics!`
- If passed in an invalid line number, it will 400 error with: `Given line {line} is not a valid line number!``

## Retrieve All Lyrics
**Request Format:** oldtownroad.php?lyric=all

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Retrieves all lyrics from the song "Old Town Road" by Lil Nas X

**Example Request:** oldtownroad.php?lyric=all

**Example Response:**

```
"Yeah, I'm gonna take my horse to the old town road
I'm gonna ride 'til I can't no more
I'm gonna take my horse to the old town road
I'm gonna ride 'til I can't no more (Kio, Kio)
I got the horses in the back
...
I got the"
```
**Error Handling:**
-If missing the line number, it will 400 error with a helpful message: `Please pass in a line number to lookup or all to generate all lyrics!`
- If passed in an invalid line number, it will 400 error with: `Given line {line} is not a valid line number!`
