## Setup
`bundle install && npm i`

### Build and serve site
`bundle exec jekyll serve`
visit http://127.0.0.1:4000/

### Update data

1. Update data from contentful

`bundle exec jekyll contentful`

2. Convert yaml->json for map

`gulp yaml`

### Deploy
`bundle exec jekyll build && gulp push-gh-pages`