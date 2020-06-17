const { src, dest, watch, series, parallel, lastRun, task } = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const fs = require('fs')
// const mkdirp = require('mkdirp')
const browserSync = require('browser-sync')
const del = require('del')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const realFavicon = require('gulp-real-favicon')
const { argv } = require('yargs')
const ghpages = require('gh-pages')

const $ = gulpLoadPlugins()
const server = browserSync.create()

const port = argv.port || 9000

const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const isDev = !isProd && !isTest

function ghpagesDeploy() {
  return ghpages.publish('dist', () => {})
}

// File where the favicon markups are stored
const FAVICON_DATA_FILE = 'faviconData.json'

function generateFavicon(done) {
  realFavicon.generateFavicon(
    {
      masterPicture: 'src/images/logo/logo.svg',
      dest: 'src/images/favicons',
      iconsPath: 'images/favicons',
      design: {
        ios: {
          pictureAspect: 'backgroundAndMargin',
          backgroundColor: '#ffffff',
          margin: '14%',
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {
          design: 'raw',
        },
        windows: {
          pictureAspect: 'noChange',
          backgroundColor: '#2d89ef',
          onConflict: 'override',
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: 'noChange',
          themeColor: '#ffffff',
          manifest: {
            display: 'standalone',
            orientation: 'notSet',
            onConflict: 'override',
            declared: true,
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
        safariPinnedTab: {
          pictureAspect: 'silhouette',
          themeColor: '#00a7ff',
        },
      },
      settings: {
        scalingAlgorithm: 'Mitchell',
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: FAVICON_DATA_FILE,
    },
    () => {
      done()
    },
  )
}

function injectFaviconMarkups() {
  return src(['src/*.html'])
    .pipe(
      realFavicon.injectFaviconMarkups(
        JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code,
      ),
    )
    .pipe(dest('src'))
}

function checkForFaviconUpdate() {
  const currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version
  realFavicon.checkForUpdates(currentVersion, (err) => {
    if (err) {
      throw err
    }
  })
}

function styles() {
  return src('src/styles/*.scss', {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe(
      $.sass
        .sync({
          outputStyle: 'expanded',
          precision: 10,
          includePaths: ['.'],
        })
        .on('error', $.sass.logError),
    )
    .pipe($.postcss([autoprefixer()]))
    .pipe(
      dest('.tmp/styles', {
        sourcemaps: !isProd,
      }),
    )
    .pipe(server.reload({ stream: true }))
}

function scripts() {
  return src('src/scripts/**/*.js', {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(
      dest('.tmp/scripts', {
        sourcemaps: !isProd ? '.' : false,
      }),
    )
    .pipe(server.reload({ stream: true }))
}

const lintBase = (files, options) => {
  return src(files)
    .pipe($.eslint(options))
    .pipe(server.reload({ stream: true, once: true }))
    .pipe($.eslint.format())
    .pipe($.if(!server.active, $.eslint.failAfterError()))
}
function lint() {
  return lintBase('src/scripts/**/*.js', { fix: true }).pipe(
    dest('src/scripts'),
  )
}
function lintTest() {
  return lintBase('test/spec/**/*.js')
}

function html() {
  return src('src/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'src', '.'] }))
    .pipe($.if(/\.js$/, $.uglify({ compress: { drop_console: true } })))
    .pipe(
      $.if(/\.css$/, $.postcss([cssnano({ safe: true, autoprefixer: false })])),
    )
    .pipe(
      $.if(
        /\.html$/,
        $.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: { compress: { drop_console: true } },
          processConditionalComments: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
        }),
      ),
    )
    .pipe(dest('dist'))
}

function images() {
  return src('src/images/**/*', { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest('dist/images'))
}

function fonts() {
  return src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}').pipe(
    $.if(!isProd, dest('.tmp/fonts'), dest('dist/fonts')),
  )
}

function extras() {
  return src(['src/*', '!src/*.html'], {
    dot: true,
  }).pipe(dest('dist'))
}

function clean() {
  return del(['.tmp', 'dist'])
}

function measureSize() {
  return src('dist/**/*').pipe($.size({ title: 'build', gzip: true }))
}

const build = series(
  clean,
  parallel(
    lint,
    series(parallel(styles, scripts), html),
    images,
    fonts,
    extras,
  ),
  measureSize,
)

function startAppServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: ['.tmp', 'src'],
      routes: {
        '/node_modules': 'node_modules',
      },
    },
  })

  watch(['src/*.html', 'src/images/**/*', '.tmp/fonts/**/*']).on(
    'change',
    server.reload,
  )

  watch('src/styles/**/*.scss', styles)
  watch('src/scripts/**/*.js', scripts)
  watch('src/fonts/**/*', fonts)
}

function startTestServer() {
  server.init({
    notify: false,
    port,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/node_modules': 'node_modules',
      },
    },
  })

  watch('test/index.html').on('change', server.reload)
  watch('src/scripts/**/*.js', scripts)
  watch('test/spec/**/*.js', lintTest)
}

function startDistServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: 'dist',
      routes: {
        '/node_modules': 'node_modules',
      },
    },
  })
}

let serve
if (isDev) {
  serve = series(clean, parallel(styles, scripts, fonts), startAppServer)
} else if (isTest) {
  serve = series(clean, scripts, startTestServer)
} else if (isProd) {
  serve = series(build, startDistServer)
}

exports.ghpagesdeploy = ghpagesDeploy
exports['generate-favicon'] = generateFavicon
exports['inject-favicon-markups'] = injectFaviconMarkups
exports['check-for-favicon-update'] = checkForFaviconUpdate
exports.serve = serve
exports.build = build
exports.default = build
