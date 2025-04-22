# Just-Ease 🧑‍⚖️
JustEase, a web application that acts as a medium of communication between the Lawyers/Advocates and the victims(subjected to any type of injustice). This platform addresses the solution to make ease of finding cases for lawyers and getting justice for victims. This platform not only helps in getting justice for victims, but also helps in career growth of lawyers. 

## Features 📱
1. User accounts for both Lawyers and Victims.
2. Victims are allowed to post the case details(Victim's name, Contact, Case category, etc..).
3. Lawyers are facilitated to explore the cases with the help of filters(Location, category, Sub-category.
4. If a Lawyer is interested in taking up a case, a notification alert is sent to Victim's mail ID.
5. A chat interface to share any furthur details if required.
6. Verification process at the time of signing-up.
7. Limited visibility of victims for privacy concerns.
8. Allow victims to track the progress of case.
9. Feedback to the lawyers from their clients.
10. AI based case recommendations to lawyers from their previously handled cases.
11. Separate section for pro-bono cases.
12. Encrypted chat & document sharing.

## Technology Stack 🧰
### FrontEnd:
React JS, TailWindCSS, Redux Toolkit, WebSockets, Formik + Yup
### BackEnd:
1. Framework               - Python Django
2. REST API                - Django Rest Framework(DRF)
3. Authentication          - JSON Web Tokens(JWT), OAuth2(Third Party)
4. Real Time Communication - Django Channels
5. Task Scheduling         - Celery + Redis
### DataBase:
1. Primary DB - PostgreSQL
2. Search & Filtering - Elastic Search
3. File Storage - Amazon S3 or Google Cloud Storage
### Security:
1. User Data Encryption - AES 256
2. API security - Django CORS headers
3. Prevent DDoS attack - DRF Throttling
4. GDPR & Legal Compliance - Django GDPR
### DevOps & Deployment:
1. Web server - Gunicorn
2. Reverse Proxy - NGINX
3. Containerization - Docker
4. CI/CD Pipeline - Github Actions
5. Hosting - Amazon AWS
### Additional:
1. Error Tracking - Sentry
2. Analytics & User Insights - PostHog
3. Logging & Debugging - ELK(ElasticSearch, LogStash, Kibana)
