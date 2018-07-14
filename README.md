## Setup
`bundle install && npm i`

### Build and serve site
`bundle exec jekyll serve`
visit http://127.0.0.1:4000/

### Update data from contentful / convert data for map
`bundle exec jekyll contentful && gulp yaml`

### Deploy
`bundle exec jekyll build && gulp push-gh-pages`