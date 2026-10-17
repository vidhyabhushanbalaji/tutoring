# HelpMeTutor

TLDR:
A website to help tutors keep up to date on lessons, payments and scheduling, and keep parents in the loop over their student's progress.

## So what was the problem
I tutor maths for Middle School to GCSE alongside university work. I'm a strong believer that my student's parents deserve to be kept in the loop, especially since they are paying for a service. However, keeping track of lesson reports between clients, alongside noting when their next sessions are, meeting links, and keeping track of payments and earnings across clients was becoming time consuming and seemed a waste of time, requiring me stitching together information from messages to parents, my calendar, a notes file, and bank statement to get all the required information.

## How I planned to solve this [high level]
My main inspiration for this was thinking about how dentistry and healthcare records work. Clinicians have access to all their patients past appointments, outcomes and notes, as well as having a view of what their day of work in terms of appointments would look like. Adding on a payment field would make a product very close to what I was aiming for.

I considered a few frameworks on how to do this

## Plans ... which failed
The initial build of the project used Vite, alongside a local PostgreSQL server and node.js backend to handle requests. This worked very well in a local testing environment, however when trying to use this setup for the web, it didn't go great. Naturally I did not expect my local PostgreSQL server to be used in production, and researched many alternatives, including GCP and AWS products. The main reason neither of these didn't go far is because the main product in both are noSQL DBs like DynamoDB or Firestore, and having started with a relational DB in PostgreSQL it didn't make sense to switch. Also considering the running cost, and fact authentication seemed to be more separate it didn't work out. I also switched from Vite to nextJS for reasons explained in the next section, in the end the node backend was the only thing which survived!

## Plans ... which worked :)
I spoke to a software engineer I knew, with experience on various cloud products, who suggested looking into Supabase. This worked out much better mainly because authentication and user data worked together really nicely. The free tier was also very suitable for my use. However authentication wasn't as smooth sailing as I'd hoped.

What I noticed when using Supabase authentication was how the JWT containing the client's access and refresh tokens was left in the client's local storage. Thinking about how XSS attacks work, and how the data left here would be quite vulnerable to this I became slightly concerned. I decided what would be best is to switch to httpOnly and hostOnly cookies (which I'd learnt in CS140 at Warwick) to reduce the risk to this.

I investigated for a bit how to look into this. There was also a small mistake I made during config with Vercel, in that my backend has a slightly different URL to my frontend, so normal sameSite cookies to prevent CSRF wouldn't work because of the cross domain issue. I needed something with easy rewrites between pages, so decided to use nextJS for easier routing and rewrites to solve this. What it meant was that when a cookie was received now, because requests had gone through a rewrite on the same domains server. 

Once again, node.js persisted throughout all of this and worked pretty well.

## Design decisions
### Security
I was not going to settle for any 50% secure vibe coded solution here. I mentioned previously how the cookies were set (sameSite, httpOnly and hostOnly) to prevent XSS and CSRF. As well as this I made sure for every request the accessor was allowed to view the data. This works by first completing the authorisation of the user, but then making sure they have the matching records for what they are requesting. E.g. if someone is correctly verified to be user 99, they should not be able to access a lesson which is for user 88. 

### Database
This became particularly complex for how the parent's can access the database - because a tutor is deemed to be static, i.e. I've assumed that a tutor teaching a student will not switch at some point. However, I have prepared for the possibility of the parent accessing the account to be changed/ removed for example if the wrong person is added there should be a fast rectification route. Instead of a manual change on every lesson record of the parent associated, I have used a join, because while costly, from knowledge of the system, I expect less requests from parents than tutors, it makes sense to optimise for tutors. Furthermore, because the tutor won't change, it makes even more sense to optimise for them.

### Updates
I also considered how I wanted updates to an existing lesson to work. I did not want a save button to be necessary, it's so easy to miss when going between pages. It needed to be automatic but obviously an API call for every character change wasn't a good idea - I instead used a debounce on the updates so that a large change can be sent just once instead of a call for every character. This makes the lesson form auto saving, and I made sure the user can see the status of the save while writing the lesson notes.

## Implemented features 
Currently the key features are:
Homepage 
  1. All tutors for parent/ all clients for a tutor
  2. All payments due to be made by parent / All payments pending for tutor (complete but not paid lessons)
  3. Lessons this week, with earnings, for tutor only
  4. Next three lessons for both tutor and parent side
  5. Ability to create a new student for a tutor, or the security code for a parent to share, to be added to a student's records

Lessons
  1. A sidebar showing all past lessons (later this may have to be done in chunks to prevent a very slow load if there's many lessons)
  2. Header showing any general notes the tutor makes (e.g. a meeting link) for both student/ parent, and private notes only the tutor can edit/see
  3. For tutor, ability to add a parent using their email and security code, and to remove that parent. For parent, ability to leave a student's records.
  4. For tutor, create lesson button, date auto populates to current time and price to default price for a student.
  5. For tutor, ability to edit shared notes, seen by parent, up to 3000 characters, and to make private notes.

Payments
  1. Ability to see unpaid/paid/both payments across all views
  2. Payments made for a given month, or custom time period up to one year
  3. Lessons which are unpaid
  4. See payments for a specific tutor/ client as appropriate

## Note on AI use
I can confidently say that the vast majority of this project was still written personally. Why? Because before this I had never used a Postgres database, managed auth, used react or done much similar. Using AI from day one just felt like wasting this learning opportunity to understand a new framework. AI was used when problems were really challenging, and had been attempted for sometime manually - this felt like a good balance between learning and problem solving, and making progress through the project. It was also used for very repetitive and tedious work - many of the TailwindCSS designs were designed with Claude to speed up development, but only after I'd learnt what the different attributes meant and did. I still manually designed many of the pages, but used Claude to make the designs slightly better or to understand why certain bugs where occurring.

Any questions? Do contact me, Linkedin is probably easiest, linkedin.com/in/vidhyabhushanbalaji

Made by Vidhyabhushan Balaji in Hampshire, UK in 2026.
