'use strict';

/**
 * Dependencies
 */
var should = require('should');
var request = require('supertest');
var path = require('path');
var views = require('../');

describe('View renderer', function() {
  it('should render layoutless views', function(done) {
    var renderer = views(
      path.join(process.cwd(), 'test', 'fixtures', 'views'),
      { default: 'ejs' }
    );

    var template = renderer('view', { msg: 'Hello, World!' });

    template(function(err, html) {
      if (err)
        return done(err);

      html.replace(/\n$/, '').should.be.eql('Hello, World!');

      done();
    });
  });

  it('should render views with default layout when specified', function(done) {
    var renderer = views(
      path.join(process.cwd(), 'test', 'fixtures', 'views'),
      { default: 'ejs', defaultLayout: 'layout' }
    );

    var template = renderer('view', { msg: 'Hello, World!' });

    template(function(err, html) {
      if (err)
        return done(err);

      html.should.containEql('Hello, World!');
      html.should.containEql('From the default layout: ');

      done();
    });
  });

  it('should render views with default layout overriden', function(done) {
    var renderer = views(
      path.join(process.cwd(), 'test', 'fixtures', 'views'),
      { default: 'ejs', defaultLayout: 'layout' }
    );

    var template = renderer('view', { msg: 'Hello, World!' }, 'another-layout');

    template(function(err, html) {
      if (err)
        return done(err);

      html.should.containEql('Hello, World!');
      html.should.not.containEql('From the default layout: ');
      html.should.containEql('From another layout: ');

      done();
    });
  });

  it('should work with layout specified without local variables');
});

