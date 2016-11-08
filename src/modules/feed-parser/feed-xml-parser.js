'use strict';

let FeedParser = require('feedparser');

/*
 List of meta properties

 title
 description
 link (website link)
 xmlurl (the canonical link to the feed, as specified by the feed)
 date (most recent update)
 pubdate (original published date)
 author
 language
 image (an Object containing url and title properties)
 favicon (a link to the favicon -- only provided by Atom feeds)
 copyright
 generator
 categories (an Array of Strings)
 * */

/*
 *
 List of article properties

 title
 description (frequently, the full article content)
 summary (frequently, an excerpt of the article content)
 link
 origlink (when FeedBurner or Pheedo puts a special tracking url in the link property, origlink contains the original link)
 permalink (when an RSS feed has a guid field and the isPermalink attribute is not set to false, permalink contains the value of guid)
 date (most recent update)
 pubdate (original published date)
 author
 guid (a unique identifier for the article)
 comments (a link to the article's comments section)
 image (an Object containing url and title properties)
 categories (an Array of Strings)
 source (an Object containing url and title properties pointing to the original source for an article; see the RSS Spec for an explanation of this element)
 enclosures (an Array of Objects, each representing a podcast or other enclosure and having a url property and possibly type and length properties)
 meta (an Object containing all the feed meta properties; especially handy when using the EventEmitter interface to listen to article emissions)
 * */

class FeedParserXML {
    constructor(page) {
        this.page = page;
    }

    parse() {
        let me = this;

        return new Promise(function (resolve, reject) {
            var feedparser = new FeedParser();

            feedparser.on('readable', function () {
                let meta = this.meta;
                let post;

                me.feed = {
                    title: meta.title,
                    description: meta.description,
                    language: meta.language,
                    image: meta.image.url,
                    posts: []
                };

                while (post = this.read()) {
                    me.feed.posts.push({
                        title: post.title,
                        body: post.summary || post.description,
                        description: post.description || post.summary,
                        link: post.origlink || post.link,
                        publicDate: post.pubdate || post.date,
                        image: post.image.url
                    });
                }

                resolve(me.feed);
            });

            feedparser.on('error', function (err) {
                reject({
                    message: 'Cannot parse feed due to: ' + err.message
                });
            });

            feedparser.end(me.page);
        });
    }
}

module.exports = FeedParserXML;