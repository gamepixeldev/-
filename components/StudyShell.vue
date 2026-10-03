<template>
  <view class="app-shell" :class="{'external-theme': view === 'externalchapters' || view === 'externalchapter' || (view === 'reading' && readingShelf === 'mag') || (view === 'article' && isExternalReading)}">
    <view class="status-spacer"></view>
    <view class="topbar" v-if="!immersive">
      <view class="back-hit" v-if="!['home','reading','vocab','grammar','puzzle'].includes(view)" @tap="back"><text class="back-arrow">‹</text></view>
      <view v-else-if="view !== 'home'" class="back-hit back-placeholder"></view>
      <view class="top-title">{{ pageTitle }}</view>
      <view v-if="view === 'home'" class="top-action" @tap="go('recent')">最近</view>
      <view v-else-if="view === 'puzzle'" class="top-action" @tap="showPuzzleGuide">ⓘ</view>
      <view v-else class="top-action"></view>
    </view>
    <view v-else class="practice-head">
      <view class="back-hit" @tap="back"><text class="back-arrow">‹</text></view>
      <text class="practice-heading">{{ pageTitle }}</text>
      <text class="step-count">{{ practiceIndex + 1 }}/{{ practiceTotal }}</text>
    </view>
    <scroll-view class="page-scroll" scroll-y :scroll-top="scrollTop" :show-scrollbar="false" lower-threshold="100" @scrolltolower="loadMorePage">
      <view v-if="view === 'home'" class="page home-page">
        <view class="hero">
          <view class="hero-copy"><text class="eyebrow">READ · LEARN · GROW</text><text class="hero-title">把英语，读进生活里</text><text class="hero-sub">从一个故事开始，慢慢读懂英文。</text></view>
          <view class="book-art"><text>读</text><text class="book-mark">READ</text></view>
          <view class="hero-orb"></view>
        </view>
        <view class="section-head"><text class="section-title">学习模块</text></view>
        <view class="module-grid">
          <view class="module-card module-blue" @tap="go('reading')"><text class="module-icon">▤</text><text class="module-name">精读</text><text class="module-desc">故事 · 词汇 · 阅读理解</text><text class="module-arrow">›</text></view>
          <view class="module-card module-gold" @tap="go('vocab')"><text class="module-icon">Aa</text><text class="module-name">单词详解</text><text class="module-desc">释义 · 例句 · 拼写</text><text class="module-arrow">›</text></view>
          <view class="module-card module-green" @tap="go('grammar')"><text class="module-icon">文</text><text class="module-name">语法学习</text><text class="module-desc">知识讲解 · 随堂练习</text><text class="module-arrow">›</text></view>
          <view class="module-card module-purple" @tap="go('puzzle')"><text class="module-icon">拼</text><text class="module-name">拼句</text><text class="module-desc">理解语意 · 排列句子</text><text class="module-arrow">›</text></view>
        </view>
        <view class="section-head"><text class="section-title">今天读点什么</text><text class="inline-link" @tap="go('reading')">全部文章　›</text></view>
        <view class="card recent-card" @tap="openArticle(0)"><view class="art-thumb art-blue"><text>{{ articles[0].icon }}</text></view><view class="recent-copy"><text class="card-title">{{ articles[0].title }}</text><text class="card-sub">{{ articles[0].translation }} · 原创短篇</text><view class="tag-row"><text class="tag">{{ articles[0].level }}</text><text class="tag">约 {{ articles[0].minutes }} 分钟</text></view></view><text class="chevron">›</text></view>
        <view class="section-head"><text class="section-title">最近学习</text><text class="inline-link" @tap="go('recent')">查看全部　›</text></view>
        <view v-if="homeRecentItems.length" v-for="(item,i) in homeRecentItems.slice(0,3)" :key="item.key" class="card recent-line" @tap="openRecent(item)"><view class="mini-icon" :class="recentTone(item.type)">{{ recentIcon(item.type) }}</view><view class="recent-copy"><text class="card-title">{{ item.title }}</text><text class="card-sub">{{ item.subtitle }}</text></view><text class="chevron">›</text></view>
        <view v-else class="card recent-empty"><text class="card-title">暂无学习记录</text></view>
      </view>

      <view v-else-if="view === 'reading'" class="page reading-page">
        <view class="tabs"><view class="design-tab" :class="{on: readingShelf === 'easy'}" @tap="readingShelf='easy'">轻松阅读</view><view class="design-tab" :class="{on: readingShelf === 'mag'}" @tap="readingShelf='mag'">外刊</view></view>
        <view v-if="readingShelf === 'easy'">
          <view class="filters"><text v-for="f in ['全部','初级','高级']" :key="f" class="filter" :class="{on: readingFilter === f}" @tap="readingFilter=f">{{ f }}</text></view>
          <view class="article-list"><view v-for="article in filteredArticles" :key="article.id" class="article" @tap="openArticle(articles.indexOf(article))"><view class="art" :class="article.theme"><text>{{ article.icon }}</text></view><view class="article-info"><text class="design-article-title">{{ article.translation }}</text><text class="design-article-desc">{{ article.title }}</text><view class="tags"><text class="tag">原创故事</text><text class="tag">{{ article.level }}</text><text class="tag">{{ storyWordCounts[articles.indexOf(article)] }} 词</text></view></view><text class="arr">›</text></view></view>
        </view>
        <view v-else class="shelf external-shelf"><view class="external-intro"><text class="eyebrow">READING COLLECTION</text><text class="external-heading">外刊小说</text></view><view v-for="(series,i) in externalSeries" :key="series.id" class="mag external-book" @tap="openExternalSeries(i)"><view class="mag-cover" :class="series.theme"><view class="cover-sun"></view><view class="cover-hill hill-back"></view><view class="cover-hill hill-front"></view><view class="cover-art">{{ series.icon }}</view><text class="cover-kicker">A SHORT STORY</text><text class="cover-title">{{ series.title }}</text><text class="cover-label">{{ series.level }} · {{ series.chapters.length }} 章</text></view><text class="mag-name">{{ series.translation }}</text><text class="mag-note">{{ series.description }}</text><text class="external-author">{{ series.author }}</text></view></view>
      </view>

      <view v-else-if="view === 'externalchapters'" class="page external-directory"><view class="series-overview"><view class="directory-cover" :class="currentExternalSeries.theme"><view class="directory-sun"></view><view class="directory-wave wave-one"></view><view class="directory-wave wave-two"></view><text class="directory-cover-icon">{{ currentExternalSeries.icon }}</text><text class="directory-cover-title">{{ currentExternalSeries.title }}</text></view><view class="series-copy"><text class="eyebrow">{{ currentExternalSeries.level }} · {{ currentExternalSeries.chapters.length }} CHAPTERS</text><text class="series-title">{{ currentExternalSeries.translation }}</text><text class="series-original">{{ currentExternalSeries.title }}</text><text class="series-description">{{ currentExternalSeries.description }}</text></view></view><view class="directory-heading"><text class="directory-heading-mark">目录</text><text class="directory-count">{{ currentExternalSeries.chapters.length }} 章</text></view><view class="chapter-list"><view v-for="(chapter,i) in currentExternalSeries.chapters" :key="chapter.title" class="chapter-row" @tap="openExternalChapter(i)"><text class="chapter-number">{{ String(i+1).padStart(2,'0') }}</text><view class="chapter-copy"><text class="chapter-title">{{ chapter.title }}</text><text class="chapter-meta">{{ chapter.translations[0] }}</text></view><view class="chapter-arrow">›</view></view></view></view>

      <view v-else-if="view === 'externalchapter'" class="page external-reading"><view class="reading-series-label"><text>{{ currentExternalSeries.translation }}</text><text>第 {{ externalChapterIndex + 1 }} 章 / {{ currentExternalSeries.chapters.length }}</text></view><text class="external-chapter-title">{{ currentExternalChapter.title }}</text><view class="chapter-reading-meta"><text>{{ currentExternalSeries.level }}</text><text>约 {{ currentExternalChapter.minutes }} 分钟</text><text>{{ currentExternalChapter.paragraphs.length }} 段</text></view><view class="reading-tools"><text class="reading-progress-label">本章阅读</text><text class="translation-toggle" @tap="showExternalTranslations = !showExternalTranslations">{{ showExternalTranslations ? '隐藏译文' : '显示译文' }}　{{ showExternalTranslations ? '−' : '+' }}</text></view><view class="reading-progress-track"><view class="reading-progress-fill" :style="{width: ((externalChapterIndex + 1) / currentExternalSeries.chapters.length * 100) + '%'}"></view></view><view class="external-paragraphs"><view v-for="(paragraph,p) in currentExternalChapter.paragraphs" :key="p" class="external-paragraph"><view class="paragraph-number">{{ String(p+1).padStart(2,'0') }}</view><view class="paragraph-content"><text v-for="(sentence,s) in paragraph" :key="s" class="external-sentence">{{ sentence }}{{ s < paragraph.length - 1 ? ' ' : '' }}</text><text v-if="showExternalTranslations" class="external-translation">{{ currentExternalChapter.translations[p] }}</text></view></view></view><view class="chapter-navigation"><button class="secondary-button" :disabled="externalChapterIndex === 0" @tap="goExternalChapter(externalChapterIndex - 1)">上一章</button><button class="primary-button" v-if="externalChapterIndex < currentExternalSeries.chapters.length - 1" @tap="goExternalChapter(externalChapterIndex + 1)">下一章</button><button class="primary-button" v-else @tap="backToExternalDirectory">返回目录</button></view></view>

      <view v-else-if="view === 'article'" class="page article-page">
        <view v-if="isExternalReading" class="article-source-kicker">{{ currentExternalSeries.translation }}　·　第 {{ externalChapterIndex + 1 }} 章</view>
        <view class="article-heading"><text class="eyebrow">{{ currentArticle.level }}　·　{{ currentArticle.minutes }} MIN READ</text><text class="large-title">{{ currentArticle.title }}</text><text class="article-translation">{{ currentArticle.translation }}</text></view>
        <view class="story-banner" :class="currentArticle.theme"><text class="story-emoji">{{ currentArticle.icon }}</text><text class="story-banner-title">{{ currentArticle.title }}</text></view>
        <view class="reading-text"><view v-for="(paragraph, p) in currentArticle.paragraphs" :key="p" class="paragraph"><text v-for="(sentence, s) in paragraph" :key="s" class="sentence">{{ formatEnglish(sentence) }}{{ s < paragraph.length - 1 ? '\u00a0' : '' }}</text><text class="translation-line">{{ currentArticle.translations[p] }}</text></view></view>
        <view class="section-head"><text class="section-title">本文配套学习</text></view>
        <view class="learning-links"><view class="learning-link" @tap="openArticleWords"><view class="mini-icon gold">Aa</view><view><text class="card-title">本文重点词汇</text><text class="card-sub">{{ articleWordEntries.length }} 个词条</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="go('articlegramdetail')"><view class="mini-icon lilac">文</view><view><text class="card-title">本文语法解析</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="startQuestions"><view class="mini-icon blue">✓</view><view><text class="card-title">阅读理解</text><text class="card-sub">{{ currentArticle.questions.length }} 道题</text></view><text class="chevron">›</text></view></view>
        <view class="reading-completion"><button class="primary-button" :class="{'reading-done':readingCompleted}" @tap="completeReading">{{ readingCompleted ? '✓ 已完成阅读' : '阅读完成' }}</button></view><view class="bottom-spacer"></view>
      </view>

      <view v-else-if="view === 'questions'" class="page question-page">
        <view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: ((questionIndex + 1) / currentArticle.questions.length * 100) + '%'}"></view></view></view>
        <text class="question-type">{{ currentQuestion.type }}</text><text class="question-title">{{ currentQuestion.prompt }}</text><text class="question-cn">{{ currentQuestion.cn }}</text>
        <view v-if="currentQuestion.kind === 'choice'" class="option-list"><view v-for="(option, i) in currentQuestion.options" :key="i" class="option-card" :class="optionState(i)" @tap="chooseOption(i)"><text class="option-letter">{{ String.fromCharCode(65 + i) }}</text><text>{{ option }}</text><text v-if="answered && i === currentQuestion.answer" class="option-check">✓</text></view></view>
        <view v-else class="fill-wrap"><input v-model="fillAnswer" class="fill-input" placeholder="输入你的答案" /></view>
        <view v-if="answered" class="explanation"><text class="explanation-title">{{ isCorrect ? '回答正确' : '看看解析' }}</text><text class="explanation-text">{{ currentQuestion.explanation }}</text></view>
        <view class="bottom-action"><button class="primary-button" @tap="questionAction">{{ answered ? (questionIndex < currentArticle.questions.length - 1 ? '下一题' : '完成练习') : '确认答案' }}</button></view>
      </view>

      <view v-else-if="view === 'vocab'" class="page vocab-page">
        <view class="vocab-intro"><text class="eyebrow">VOCABULARY</text><text class="large-title">每天几个词，慢慢学扎实</text></view>
        <view class="card today-word-card"><view class="today-card-top"><view><text class="today-label">TODAY'S WORDS</text><text class="today-title">今日单词</text></view><text class="today-date">{{ todayDateLabel }}</text></view><view class="today-progress-row"><text>已完成 {{ todayCompletedCount }} / {{ todayWordIndexes.length }}</text></view><view class="progress-track"><view class="progress-fill" :style="{width: todayProgressPercent + '%'}"></view></view><view class="today-preview"><text v-for="index in todayWordIndexes" :key="index" class="today-chip" :class="{'today-chip-done': isTodayWordDone(index)}">{{ allWords[index].word }}<text v-if="isTodayWordDone(index)"> ✓</text></text></view><button class="primary-button" @tap="openTodayWord">{{ todayCompletedCount === todayWordIndexes.length ? '再学一遍今日单词' : todayCompletedCount ? '继续今日学习' : '开始今日学习' }}</button><text class="today-spell-link" @tap="beginTodaySpelling">直接拼写　›</text></view>
        <view class="card favorite-entry" @tap="openFavoriteWords"><text class="shortcut-symbol shortcut-star">★</text><view class="favorite-entry-copy"><text class="shortcut-title">我的收藏</text><text class="shortcut-meta">已收藏 {{ favoriteWords.length }} 个单词</text></view><text class="shortcut-arrow">›</text></view>
        <view class="section-head"><text class="section-title">最近学习</text></view>
        <view v-if="recentWords.length" class="word-list"><view v-for="item in recentWords" :key="item.key" class="card word-row" @tap="openWord(item.index, true)"><view><text class="word-main">{{ allWords[item.index].word }}</text><text class="word-sub">{{ allWords[item.index].pos }}　{{ allWords[item.index].meaning }}</text></view><text class="chevron">›</text></view></view>
        <view v-else class="card word-empty"><text class="card-title">暂无单词记录</text><text class="inline-link" @tap="openTodayWord">开始今日学习　›</text></view>
      </view>

      <view v-else-if="view === 'wordlist'" class="page"><view class="intro-block"><text class="eyebrow">{{ isScopedArticle ? 'ARTICLE WORDS' : 'SAVED WORDS' }}</text><text class="large-title">{{ isScopedArticle ? currentArticle.translation + ' · 重点词汇' : '我的收藏' }}</text></view><view v-if="visibleWordList.length" class="word-list"><view v-for="word in visibleWordList" :key="word.word" class="card word-row" @tap="openWord(allWords.indexOf(word), !isScopedArticle)"><view><text class="word-main">{{ word.word }}</text><text class="word-sub">{{ word.pos }}　{{ word.meaning }}</text></view><text v-if="wordCompletion[word.word]" class="row-learned">已学完</text><text v-if="isFavorite(word.word)" class="row-favorite">★</text><text class="chevron">›</text></view></view><view v-else class="card word-empty"><text class="card-title">暂无收藏</text><text class="inline-link" @tap="back">返回今日单词　›</text></view></view>

      <view v-else-if="view === 'worddetail'" class="page word-detail-page"><view class="word-hero"><view class="word-hero-top"><view class="word-source"><text class="eyebrow">{{ dailyStudy ? '今日单词' : isScopedArticle ? isExternalReading ? '本章重点词汇' : '本文重点词汇' : '单词详解' }}</text><text v-if="dailyStudy || isScopedArticle" class="word-source-progress">{{ dailyStudy ? todayStudyPosition + 1 : scopedWordPosition + 1 }}/{{ dailyStudy ? studyWordIndexes.length : scopedWordIndexes.length }}</text></view><text class="favorite-toggle" :class="{active:isFavorite(currentWord.word)}" @tap="toggleFavorite(currentWord.word)">{{ isFavorite(currentWord.word) ? '★' : '☆' }}</text></view><text class="word-display">{{ currentWord.word }}</text><view class="pronounce-row"><text class="pronunciation">{{ currentWord.ipa }}</text></view><view class="word-badges"><text class="tag">{{ currentWord.pos }}</text><text class="tag">{{ currentWord.frequency }}</text><text v-if="dailyStudy && isCurrentWordLearned && !isCurrentTodayWordDone" class="tag prior-learned-tag">曾学过 · 今日待练</text><text v-else-if="isCurrentWordLearned" class="tag learned-tag">✓ 已学完</text></view><text class="meaning">{{ currentWord.meaning }}</text></view>
        <view v-if="currentWordContent.type === 'officialAccount'" class="card source-card"><text class="detail-label">公众号文章</text><text class="card-title">{{ currentWordContent.title || '查看关联的公众号文章' }}</text><text class="card-sub">{{ currentWordContent.summary || '词汇详解内容来自关联的公众号文章。' }}</text><button class="source-button" @tap="openOfficialSource(currentWordContent)">阅读公众号原文</button></view><rich-text v-else class="word-detail-content" :nodes="currentWordContent.html" />
      </view>

      <view v-else-if="view === 'spell'" class="page spell-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: spellProgressPercent + '%'}"></view></view></view><view class="spell-prompt"><text class="eyebrow">根据中文释义拼出单词</text><text class="spell-meaning">{{ spellWords[spellIndex].pos }}　{{ spellWords[spellIndex].meaning }}</text><text class="hint-link" @tap="requestAnswerHint('spell')">需要提示？</text></view><view class="card spelling-card"><view class="letter-slots"><view v-for="(letter,i) in spellSlots" :key="i" class="letter-slot" :class="{ 'answer-correct': spellChecked && letter === spellWords[spellIndex].word.toLowerCase()[i], 'answer-wrong': spellChecked && letter !== spellWords[spellIndex].word.toLowerCase()[i] }" @tap="removeLetter(i)">{{ letter || '' }}</view></view><view class="letter-bank"><button v-for="(letter,i) in letterBank" :key="i" class="letter-key" :disabled="usedLetters.includes(i) || answered" @tap="addLetter(i)">{{ letter }}</button></view><view v-if="spellChecked" class="explanation" :class="{ 'feedback-wrong': !isCorrect }"><text class="explanation-title">{{ isCorrect ? (spellReturn === 'worddetail' ? '拼写正确，本词已学完！' : '拼写正确！') : '标红的字母位置不对，调整后再试' }}</text><text v-if="isCorrect" class="explanation-text">{{ spellWords[spellIndex].word }}　{{ spellWords[spellIndex].meaning }}</text></view></view><view class="bottom-action"><button class="primary-button" @tap="spellAction">{{ spellActionLabel }}</button></view></view>

      <view v-else-if="view === 'grammar' || view === 'gramlist'" class="page grammar-page">
        <view class="hero-home grammar-home-hero"><view class="eyebrow">GRAMMAR NOTES</view><text class="grammar-hero-title">理解规则，<br/>再把句子说清楚。</text><view class="hero-book grammar-book">文</view></view>
        <view class="filters grammar-filters"><text v-for="f in ['全部','基础','时态','句型']" :key="f" class="filter" :class="{on: grammarFilter === f}" @tap="grammarFilter=f">{{ f }}</text></view>
        <view class="grammarlist"><view v-for="(item,i) in visibleGrammar" :key="item.title" class="gramrow" @tap="openGrammar(item.sourceIndex)"><view class="gramicon">{{ ['时','让','时','句'][item.sourceIndex % 4] }}</view><view class="gramrow-copy"><text class="gramrow-title">{{ item.title }}</text><text class="gramrow-sub">{{ item.level }}　·　讲解与练习</text></view><text class="arr">›</text></view></view>
      </view>

      <view v-else-if="view === 'articlegramdetail'" class="page"><view class="grammar-hero"><text class="eyebrow">ARTICLE GRAMMAR</text><text class="large-title">{{ isExternalReading ? currentArticle.title : currentArticle.translation }} · 语法解析</text><text class="muted">{{ isExternalReading ? currentExternalSeries.translation + ' · 第 ' + (externalChapterIndex + 1) + ' 章' : currentArticle.title }}</text></view><rich-text class="rich-content card" :nodes="articleGrammarContent.html" /></view>

      <view v-else-if="view === 'gramdetail'" class="page"><view class="grammar-hero"><text class="eyebrow">GRAMMAR NOTE</text><text class="large-title">{{ currentGrammar.title }}</text><text class="muted">{{ currentGrammar.summary }}</text></view><view v-if="currentGrammarContent.type === 'officialAccount'" class="card source-card"><text class="detail-label">公众号文章</text><text class="card-title">{{ currentGrammarContent.title || '查看关联的公众号文章' }}</text><text class="card-sub">{{ currentGrammarContent.summary || '语法详解内容来自关联的公众号文章。' }}</text><button class="source-button" @tap="openOfficialSource(currentGrammarContent)">阅读公众号原文</button></view><rich-text v-else class="rich-content card" :nodes="currentGrammarContent.html" /><view class="bottom-action"><button class="primary-button" @tap="startGrammarQuiz">做几道练习</button></view></view>

      <view v-else-if="view === 'gramquiz'" class="page question-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: (grammarAnswered ? '100%' : '35%')}"></view></view><text class="muted">练习</text></view><text class="question-type">语法小练习</text><text class="question-title">{{ currentGrammar.quiz.prompt }}</text><view class="option-list"><view v-for="(option,i) in currentGrammar.quiz.options" :key="i" class="option-card" :class="optionState(i)" @tap="chooseGrammar(i)"><text class="option-letter">{{ String.fromCharCode(65+i) }}</text><text>{{ option }}</text><text v-if="grammarAnswered && i === currentGrammar.quiz.answer" class="option-check">✓</text></view></view><view v-if="grammarAnswered" class="explanation"><text class="explanation-title">{{ grammarCorrect ? '回答正确' : '看看解析' }}</text><text class="explanation-text">{{ currentGrammar.quiz.explanation }}</text></view><view class="bottom-action"><button class="primary-button" @tap="grammarQuizAction">{{ grammarAnswered ? '返回语法解析' : '确认答案' }}</button></view></view>

      <view v-else-if="view === 'puzzle'" class="page puzzle-page">
        <view class="hero-home puzzle-home-hero"><view class="eyebrow">SENTENCE PUZZLE</view><text class="puzzle-hero-title">读懂中文，<br/>重新排好英文。</text><view class="hero-book puzzle-book">拼</view></view>
        <view v-if="resumablePuzzle" class="puzzle-resume-card" @tap="startPuzzle(resumablePuzzle.setIndex)"><view class="puzzle-resume-top"><text>继续上次练习</text><text>{{ resumablePuzzle.cursor }} / {{ resumablePuzzle.items.length }} 句</text></view><text class="puzzle-resume-title">{{ resumablePuzzle.title }}</text><view class="puzzle-resume-bottom"><view class="puzzle-resume-track"><view :style="{width: resumablePuzzle.cursor / resumablePuzzle.items.length * 100 + '%'}"></view></view><text>继续　›</text></view></view>
        <view class="section-head puzzle-list-head"><text class="section-title">拼句练习</text><text class="section-note">{{ visiblePuzzleSets.length }} 篇</text></view>
        <view class="puzzle-filters"><text v-for="filter in puzzleFilters" :key="filter.id" class="puzzle-filter" :class="{on:puzzleFilter === filter.id}" @tap="selectPuzzleFilter(filter.id)">{{ filter.label }}</text></view>
        <view v-for="set in pagedPuzzleSets" :key="set.id" class="card puzzle-source-card"><view class="puzzle-source" @tap="startPuzzle(set.setIndex)"><view class="thumb puzzle-thumb">{{ set.icon }}</view><view class="puzzle-source-copy"><text class="card-title">{{ set.title }}</text><text class="card-sub">{{ set.sourceArticleId ? puzzleSourceLabel(set) : set.subtitle }}　·　{{ set.items.length }} 句</text><text v-if="puzzleProgressFor(set).cursor || puzzleProgressFor(set).completed" class="puzzle-set-status">{{ puzzleProgressFor(set).completed ? '已完成' : '已完成 ' + puzzleProgressFor(set).cursor + ' / ' + set.items.length + ' 句' }}</text></view><text class="arr">›</text></view><view v-if="puzzleProgressFor(set).cursor || puzzleProgressFor(set).completed" class="puzzle-card-bottom"><view class="puzzle-card-track"><view :style="{width: (puzzleProgressFor(set).completed ? 100 : puzzleProgressFor(set).cursor / set.items.length * 100) + '%'}"></view></view><text class="puzzle-set-restart" @tap.stop="startPuzzle(set.setIndex,true)">从头开始</text></view></view>
        <view v-if="pagedPuzzleSets.length < visiblePuzzleSets.length" class="puzzle-load-state">下滑加载更多</view>
      </view>
      <view v-else-if="view === 'puzzleplay'" class="page puzzleplay-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: ((puzzleIndex + (puzzleAnswered ? 1 : 0)) / currentPuzzleSet.items.length * 100) + '%'}"></view></view><text class="muted">{{ puzzleIndex + 1 }} / {{ currentPuzzleSet.items.length }}</text></view><text class="question-type">{{ currentPuzzleSet.title }}</text><text class="puzzle-cn">{{ puzzle.cn }}</text><text class="hint-link puzzle-hint" @tap="requestAnswerHint('puzzle')">需要提示？</text><view class="placed-words"><text v-if="!puzzleWords.length" class="muted">点选下方单词，组成正确句子</text><view v-for="(word,i) in puzzleWords" :key="i" class="word-token chosen" :class="{ 'answer-correct': puzzleChecked && word === puzzle.answer.split(' ')[i], 'answer-wrong': puzzleChecked && word !== puzzle.answer.split(' ')[i] }" @tap="unpickPuzzle(i)">{{ word }}</view></view><view class="word-bank"><view v-for="(word,i) in shuffledPuzzle" :key="i" class="word-token" :class="{used: usedPuzzle.includes(i)}" @tap="pickPuzzle(i)">{{ word }}</view></view><view v-if="puzzleChecked" class="explanation" :class="{ 'feedback-wrong': !puzzleCorrect }"><text class="explanation-title">{{ puzzleCorrect ? '语序正确！' : '标红的词块位置不对，调整后再试' }}</text><text v-if="puzzleCorrect" class="explanation-text">{{ puzzle.answer }}</text></view><view class="bottom-action"><button class="primary-button" @tap="puzzleAction">{{ puzzleAnswered ? (puzzleIndex < currentPuzzleSet.items.length - 1 ? '下一句' : '完成练习') : '检查答案' }}</button></view></view>

      <view v-else-if="view === 'recent'" class="page recent-page">
        <view class="intro-block"><text class="eyebrow">YOUR LEARNING</text><text class="large-title">最近学习</text></view>
        <view class="recent-category-tabs"><view v-for="category in recentCategories" :key="category.id" class="recent-category" :class="{active:recentCategory===category.id}" @tap="selectRecentCategory(category.id)"><text>{{ category.label }}</text><text class="recent-count">{{ category.items.length }}</text></view></view>
        <view v-if="visibleRecentItems.length" class="recent-section">
          <view v-for="item in pagedRecentItems" :key="item.key" class="card recent-entry" @tap="openRecent(item)"><view class="mini-icon" :class="recentTone(item.type)">{{ recentIcon(item.type) }}</view><view class="recent-copy"><text class="card-title">{{ item.title }}</text><text class="card-sub">{{ recentSubtitle(item) }}</text><view v-if="item.type==='puzzle'" class="puzzle-progress-track"><view class="puzzle-progress-fill" :style="{width:puzzleProgressPercent(item)+'%'}"></view></view></view><text v-if="item.type!=='puzzle'" class="chevron">›</text><view v-else class="puzzle-recent-actions"><text class="resume-puzzle" @tap.stop="openRecent(item)">{{ item.puzzleCompleted ? '再练一次' : '继续' }}</text><text class="restart-puzzle" @tap.stop="startPuzzle(item.index,true)">从头开始</text></view></view>
          <text class="clear-history" @tap="clearRecent">清空最近学习记录</text>
        </view>
        <view v-else class="recent-empty"><view class="empty-illustration"><view class="empty-book">▤</view><view class="empty-spark spark-one">✦</view><view class="empty-spark spark-two">✧</view><view class="empty-orbit"></view></view><text class="empty-title">{{ recentEmptyTitle }}</text><button class="empty-action" @tap="go(recentCategory==='reading'?'reading':recentCategory==='grammar'?'grammar':recentCategory==='word'?'vocab':'puzzle')">去{{ recentCategoryLabel }}看看 <text>›</text></button></view>
      </view>
    </scroll-view>
    <view v-if="view === 'worddetail' && !wordReadOnly" class="fixed-word-action"><button class="primary-button" @tap="beginSpelling('worddetail')">下一步 · 拼写练习</button></view>
    <view v-if="!immersive && ['home','reading','vocab','grammar','puzzle'].includes(view)" class="tabbar"><view v-for="tab in tabs" :key="tab.id" class="tab-item" :class="{active: activeTab === tab.id}" @tap="go(tab.id)"><text class="tab-icon">{{ tab.icon }}</text><text>{{ tab.label }}</text></view></view>
  </view>
  <view v-if="toastMessage" class="toast">{{ toastMessage }}</view>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { articles, externalSeries as externalSeriesData, words, grammar, puzzleSets as puzzleSetsData, getWordContentSource, getGrammarContentSource, getArticleGrammarContentSource } from '../pages/index/learning-data.js'
import { rewardedAdUnitId } from '../config/rewarded-ad.js'
import { dailyWordIndexes, localDayKey } from '../config/daily-words.js'
import { loadRecentItems, loadReadingCompletion, loadWordCompletion, loadFavoriteWords, loadDailyWordProgress, loadPuzzleProgress, saveRecentItem, savePuzzleProgress as persistPuzzleProgress } from '../services/study-records.js'

const props = defineProps({ initialView: { type: String, default: 'home' }, initialIndex: { type: Number, default: 0 }, initialPuzzleIndex: { type: Number, default: 0 }, initialChapter: { type: Number, default: 0 }, initialSource: { type: String, default: 'article' }, initialSeriesIndex: { type: Number, default: -1 }, sourceArticleIndex: { type: Number, default: -1 }, returnView: { type: String, default: 'vocab' }, wordReadOnly: { type: Boolean, default: false }, initialDailyStudy: { type: Boolean, default: false }, initialStudyDate: { type: String, default: '' } })
const view = ref(props.initialView)
const activeTab = ref(props.initialView)
const viewStack = ref([])
const scrollTop = ref(0)
const readingFilter = ref('全部')
const readingShelf = ref('easy')
const grammarFilter = ref('全部')
const articleIndex = ref(props.sourceArticleIndex >= 0 && ['worddetail','spell'].includes(props.initialView) ? props.sourceArticleIndex : props.initialIndex)
const readingSource = ref(props.initialSource)
const externalSeriesIndex = ref(['externalchapters','externalchapter'].includes(props.initialView) || props.initialSource === 'external' ? props.initialSeriesIndex >= 0 ? props.initialSeriesIndex : props.initialIndex : 0)
const externalChapterIndex = ref(props.initialChapter)
const showExternalTranslations = ref(true)
const wordIndex = ref(props.initialIndex)
const wordReadOnly = ref(props.wordReadOnly)
const dailyStudy = ref(props.initialDailyStudy)
const todayKey = ref(localDayKey())
const studyDate = ref(props.initialStudyDate || todayKey.value)
const grammarIndex = ref(props.initialIndex)
const sourceArticleIndex = ref(props.sourceArticleIndex)
const questionIndex = ref(0)
const selectedOption = ref(-1)
const answered = ref(false)
const isCorrect = ref(false)
const fillAnswer = ref('')
const spellIndex = ref(props.initialView === 'spell' && props.returnView === 'today' ? Math.max(0, dailyWordIndexes(props.initialStudyDate || localDayKey(), words.length).indexOf(props.initialIndex)) : 0)
const spellReturn = ref(props.returnView)
const spellWords = ref(props.initialView === 'spell' ? props.returnView === 'worddetail' ? [words[props.initialIndex] || words[0]] : props.returnView === 'today' ? dailyWordIndexes(props.initialStudyDate || localDayKey(), words.length).map(index => words[index]) : props.returnView === 'articlewordlist' ? (props.initialSource === 'external' ? ((externalSeriesData[props.initialIndex] || externalSeriesData[0]).chapters[props.initialChapter]?.words || []) : ((articles[props.sourceArticleIndex] || articles[0]).words || [])).map(id => words.find(word => word.word === id)).filter(Boolean) : words : words)
const spellSlots = ref([])
const spellChecked = ref(false)
const letterBank = ref([])
const usedLetters = ref([])
const grammarAnswered = ref(false)
const grammarCorrect = ref(false)
const puzzleWords = ref([])
const shuffledPuzzle = ref([])
const usedPuzzle = ref([])
const puzzleAnswered = ref(false)
const puzzleCorrect = ref(false)
const puzzleChecked = ref(false)
const toastMessage = ref('')
const tabs = [{id:'home',label:'首页',icon:'⌂'},{id:'reading',label:'精读',icon:'▤'},{id:'grammar',label:'语法',icon:'文'},{id:'vocab',label:'单词',icon:'Aa'},{id:'puzzle',label:'拼句',icon:'拼'}]
const recentItems = ref(loadRecentItems())
const readingCompletion = ref(loadReadingCompletion())
const wordCompletion = ref(loadWordCompletion())
const favoriteWordIds = ref(loadFavoriteWords())
const dailyWordProgress = ref(loadDailyWordProgress(todayKey.value))
const recentCategory = ref('reading')
const puzzleProgress = ref(loadPuzzleProgress())
const allWords = words
const todayWordIndexes = computed(() => dailyWordIndexes(todayKey.value, allWords.length))
const studyWordIndexes = computed(() => dailyWordIndexes(studyDate.value, allWords.length))
const todayDateLabel = computed(() => { const [, month, day] = todayKey.value.split('-'); return `${Number(month)}月${Number(day)}日` })
const todayCompletedCount = computed(() => todayWordIndexes.value.filter(index => dailyWordProgress.value[allWords[index].word]).length)
const todayProgressPercent = computed(() => todayWordIndexes.value.length ? todayCompletedCount.value / todayWordIndexes.value.length * 100 : 0)
const favoriteWords = computed(() => allWords.filter(word => favoriteWordIds.value.includes(word.word)))
const todayStudyPosition = computed(() => studyWordIndexes.value.indexOf(wordIndex.value))
const recentWords = computed(() => recentItems.value.filter(item => item.type === 'word' && allWords[item.index] && wordCompletion.value[allWords[item.index].word]).slice(0, 5))
const homeRecentItems = computed(() => recentItems.value.filter(item => item.type !== 'word' || wordCompletion.value[allWords[item.index]?.word]))
const grammarItems = grammar
const storyWordCounts = [148, 126]
const isExternalReading = computed(() => readingSource.value === 'external')
const isScopedArticle = computed(() => isExternalReading.value || sourceArticleIndex.value >= 0)
const currentArticle = computed(() => isExternalReading.value ? (() => { const chapter = currentExternalChapter.value; const series = currentExternalSeries.value; return {id:'external-' + series.id + '-' + externalChapterIndex.value,title:chapter.title,translation:series.translation,level:series.level,minutes:chapter.minutes,icon:series.icon,theme:series.theme,paragraphs:chapter.paragraphs,translations:chapter.translations,words:chapter.words || [],questions:chapter.questions || [],grammarContentSource:chapter.grammarContentSource,chapterCount:series.chapters.length} })() : (articles[articleIndex.value] || articles[0]))
const readingCompletionKey = computed(() => isExternalReading.value ? 'external:' + currentExternalSeries.value.id + ':' + externalChapterIndex.value : 'article:' + currentArticle.value.id)
const readingCompleted = computed(() => Boolean(readingCompletion.value[readingCompletionKey.value]))
const visibleWordList = computed(() => isScopedArticle.value ? (currentArticle.value.words || []).map(id => allWords.find(word => word.word === id)).filter(Boolean) : favoriteWords.value)
const scopedWordIndexes = computed(() => isScopedArticle.value ? visibleWordList.value.map(word => allWords.indexOf(word)) : [])
const scopedWordPosition = computed(() => scopedWordIndexes.value.indexOf(wordIndex.value))
const articleWordEntries = computed(() => (currentArticle.value.words || []).map(id => allWords.find(word => word.word === id)).filter(Boolean))
const articleGrammarContent = computed(() => getArticleGrammarContentSource(currentArticle.value, isExternalReading.value ? currentExternalChapter.value.grammarNotes : []))
const currentWord = computed(() => allWords[wordIndex.value] || allWords[0])
const isCurrentWordLearned = computed(() => Boolean(wordCompletion.value[currentWord.value.word]))
const isCurrentTodayWordDone = computed(() => Boolean((studyDate.value === todayKey.value ? dailyWordProgress.value : loadDailyWordProgress(studyDate.value))[currentWord.value.word]))
const spellActionLabel = computed(() => !answered.value ? '检查拼写' : spellReturn.value === 'worddetail' ? nextStudyWordIndex.value >= 0 ? '下一个单词' : dailyStudy.value ? '完成今日学习' : isScopedArticle.value ? isExternalReading.value ? '完成本章词汇' : '完成本文词汇' : '完成本轮学习' : spellIndex.value < spellWords.value.length - 1 ? '下一个单词' : spellReturn.value === 'today' ? '完成今日拼写' : '完成练习')
const nextStudyWordIndex = computed(() => dailyStudy.value ? studyWordIndexes.value[todayStudyPosition.value + 1] ?? -1 : isScopedArticle.value ? scopedWordIndexes.value[scopedWordPosition.value + 1] ?? -1 : wordIndex.value < allWords.length - 1 ? wordIndex.value + 1 : -1)
const spellProgressPercent = computed(() => spellWords.value.length ? (spellIndex.value + (answered.value && isCorrect.value ? 1 : 0)) / spellWords.value.length * 100 : 0)
const currentGrammar = computed(() => grammarItems[grammarIndex.value] || grammarItems[0])
const currentWordContent = computed(() => getWordContentSource(currentWord.value))
const currentGrammarContent = computed(() => getGrammarContentSource(currentGrammar.value))
const currentQuestion = computed(() => currentArticle.value.questions[questionIndex.value] || currentArticle.value.questions[0])
const filteredArticles = computed(() => readingFilter.value === '全部' ? articles : articles.filter((a,i) => readingFilter.value === '高级' ? i > 0 : i === 0))
const visibleGrammar = computed(() => grammarFilter.value === '全部' ? grammarItems.map((item,index) => ({ ...item, sourceIndex:index })) : grammarItems.map((item,index) => ({ ...item, sourceIndex:index })).filter(item => grammarFilter.value === '基础' ? item.level.includes('基础') : grammarFilter.value === '时态' ? item.title.includes('时') || item.title.includes('过去') : item.title.includes('从句')))
const externalSeries = externalSeriesData
const currentExternalSeries = computed(() => externalSeries[externalSeriesIndex.value] || externalSeries[0])
const currentExternalChapter = computed(() => currentExternalSeries.value.chapters[externalChapterIndex.value] || currentExternalSeries.value.chapters[0])
const pageTitle = computed(() => ({home:'读句 English',reading:'精读',article:'文章精读',questions:'阅读理解',externalchapters:'小说目录',externalchapter:'章节阅读',vocab:'单词详解',wordlist:isScopedArticle.value ? '本文重点词汇' : '我的收藏',worddetail:'单词详解',spell:'拼写练习',grammar:'语法学习',gramlist:'语法拆解',gramdetail:'语法详解',gramquiz:'语法练习',articlegramdetail:'本文语法解析',puzzle:'拼句练习',puzzleplay:'拼句练习',recent:'最近学习'})[view.value] || '读句 English')
const immersive = computed(() => ['spell','questions','gramquiz'].includes(view.value))
const practiceIndex = computed(() => view.value === 'spell' ? spellIndex.value : view.value === 'gramquiz' ? 0 : questionIndex.value)
const practiceTotal = computed(() => view.value === 'spell' ? spellWords.value.length : view.value === 'gramquiz' ? 1 : currentArticle.value.questions.length)
const puzzleSets = puzzleSetsData
const puzzleFilters = [{id:'all',label:'全部'},{id:'independent',label:'独立练习'},{id:'article',label:'精读配套'}]
const puzzleFilter = ref('all')
const puzzlePageSize = ref(6)
const visiblePuzzleSets = computed(() => puzzleSets.map((set,setIndex) => ({...set,setIndex})).filter(set => puzzleFilter.value === 'all' || (puzzleFilter.value === 'article' ? Boolean(set.sourceArticleId) : !set.sourceArticleId)).sort((a,b) => Number(Boolean(b.sourceArticleId)) - Number(Boolean(a.sourceArticleId))))
const pagedPuzzleSets = computed(() => visiblePuzzleSets.value.slice(0,puzzlePageSize.value))
const resumablePuzzle = computed(() => puzzleSets.map((set,setIndex) => ({...set,setIndex,...puzzleProgressFor(set)})).filter(set => set.cursor > 0 && set.cursor < set.items.length && !set.completed).sort((a,b) => b.updatedAt - a.updatedAt)[0] || null)
const recentCategories = computed(() => [
  {id:'reading',label:'精读',items:recentItems.value.filter(item => ['article','externalArticle'].includes(item.type))},
  {id:'grammar',label:'语法',items:recentItems.value.filter(item => item.type === 'grammar')},
  {id:'word',label:'单词',items:recentItems.value.filter(item => item.type === 'word' && wordCompletion.value[allWords[item.index]?.word])},
  {id:'puzzle',label:'拼句',items:recentItems.value.filter(item => item.type === 'puzzle')}
])
const visibleRecentItems = computed(() => recentCategories.value.find(category => category.id === recentCategory.value)?.items || [])
const pagedRecentItems = computed(() => visibleRecentItems.value.slice(0, recentPageSize.value))
const recentPageSize = ref(10)
const recentCategoryLabel = computed(() => recentCategories.value.find(category => category.id === recentCategory.value)?.label || '学习')
const recentEmptyTitle = computed(() => ({reading:'还没有精读记录',grammar:'还没有语法学习记录',word:'还没有单词学习记录',puzzle:'还没有拼句进度'})[recentCategory.value])
const puzzleSetIndex = ref(props.initialView === 'puzzleplay' ? props.initialIndex : 0)
const puzzleIndex = ref(props.initialView === 'puzzleplay' ? props.initialPuzzleIndex : 0)
const currentPuzzleSet = computed(() => puzzleSets[puzzleSetIndex.value] || puzzleSets[0])
const puzzle = computed(() => currentPuzzleSet.value.items[puzzleIndex.value] || currentPuzzleSet.value.items[0])

function toast(message) { toastMessage.value = message; setTimeout(() => { if (toastMessage.value === message) toastMessage.value = '' }, 1800) }
let rewardedVideoAd = null
let pendingHint = null
let hintBusy = false
let hintPageActive = true
function hintStillCurrent(hint) { return hintPageActive && (hint.kind === 'spell' ? view.value === 'spell' && spellWords.value[spellIndex.value]?.word === hint.source : view.value === 'puzzleplay' && currentPuzzleSet.value.id === hint.setId && puzzleIndex.value === hint.index) }
function finishHintAd(res) {
  const hint = pendingHint
  pendingHint = null
  hintBusy = false
  if (!hint || !hintStillCurrent(hint)) return
  if (!res?.isEnded) { toast('未完整观看广告，提示未解锁'); return }
  uni.showModal({title:hint.kind === 'spell' ? '正确拼写' : '正确语序',content:hint.answer,showCancel:false,confirmText:'继续填写'})
}
function failHintAd() { if (!pendingHint) return; pendingHint = null; hintBusy = false; if (hintPageActive) uni.showModal({title:'广告暂不可用',content:'广告加载失败，请稍后再试。答案尚未解锁。',showCancel:false,confirmText:'知道了'}) }
function requestAnswerHint(kind) {
  if (hintBusy) return
  const hint = kind === 'spell' ? {kind,source:spellWords.value[spellIndex.value]?.word,answer:spellWords.value[spellIndex.value]?.word} : {kind,setId:currentPuzzleSet.value.id,index:puzzleIndex.value,answer:puzzle.value.answer}
  if (!hint.answer) return
  hintBusy = true
  uni.showModal({title:'观看广告获取提示',content:'需要完整观看一段激励视频广告，才能查看' + (kind === 'spell' ? '正确拼写' : '正确语序') + '。是否观看？',confirmText:'观看广告',cancelText:'暂不观看',success:res => { if (!res.confirm) { hintBusy = false; return } showHintAd(hint) },fail:() => { hintBusy = false }})
}
function showHintAd(hint) {
  if (!rewardedAdUnitId) { hintBusy = false; uni.showModal({title:'广告暂不可用',content:'激励视频广告位尚未配置，暂时无法解锁提示。',showCancel:false,confirmText:'知道了'}); return }
  if (typeof uni.createRewardedVideoAd !== 'function') { hintBusy = false; uni.showModal({title:'当前环境不支持',content:'激励视频需要在已配置广告位的微信小程序中观看，当前预览环境无法解锁提示。',showCancel:false,confirmText:'知道了'}); return }
  pendingHint = hint
  try {
    if (!rewardedVideoAd) {
      rewardedVideoAd = uni.createRewardedVideoAd({adUnitId:rewardedAdUnitId})
      rewardedVideoAd.onClose(finishHintAd)
      rewardedVideoAd.onError(failHintAd)
    }
    Promise.resolve(rewardedVideoAd.show()).catch(async () => { try { await rewardedVideoAd.load(); await rewardedVideoAd.show() } catch (_) { failHintAd() } })
  } catch (_) { failHintAd() }
}
function syncRecentItems() { recentItems.value = loadRecentItems() }
function syncReadingCompletion() { readingCompletion.value = loadReadingCompletion() }
function syncWordCompletion() { wordCompletion.value = loadWordCompletion() }
function syncFavoriteWords() { favoriteWordIds.value = loadFavoriteWords() }
function syncDailyWordProgress() { dailyWordProgress.value = loadDailyWordProgress(todayKey.value) }
function refreshToday() { const nextDay = localDayKey(); if (nextDay !== todayKey.value) { todayKey.value = nextDay; syncDailyWordProgress() } }
function syncPuzzleProgress() { puzzleProgress.value = loadPuzzleProgress() }
function trackRecent(type, index, title, subtitle, extra = {}) {
  recentItems.value = saveRecentItem(recentItems.value, type, index, title, subtitle, extra)
}
function recentIcon(type) { return ({article:'▤',externalArticle:'▤',word:'Aa',grammar:'文',puzzle:'拼'})[type] || '•' }
function recentTone(type) { return ({article:'blue',word:'mint',grammar:'lilac',puzzle:'gold'})[type] || 'blue' }
function recentSubtitle(item) { if (item.type === 'word') return (wordCompletion.value[allWords[item.index]?.word] ? '已学完 · ' : '最近浏览 · ') + item.subtitle; if (item.type !== 'puzzle') return item.subtitle; const total = item.puzzleTotal || (puzzleSets[item.index]?.items.length || 0); if (item.puzzleCompleted) return '已完成 · ' + total + ' 句'; return '已完成 ' + (item.puzzleCursor || 0) + ' / ' + total + ' 句' }
function puzzleProgressPercent(item) { const total = item.puzzleTotal || (puzzleSets[item.index]?.items.length || 1); return Math.max(0, Math.min(100, item.puzzleCompleted ? 100 : (item.puzzleCursor || 0) / total * 100)) }
function puzzleProgressFor(set) { const saved = puzzleProgress.value[set.id] || {}; const recentTime = recentItems.value.find(item => item.type === 'puzzle' && puzzleSets[item.index]?.id === set.id)?.time || 0; return {cursor:Math.min(saved.cursor || 0,set.items.length),completed:Boolean(saved.completed),updatedAt:saved.updatedAt || recentTime} }
function puzzleSourceLabel(set) { const source = articles.find(article => article.id === set.sourceArticleId); return source ? '来自《' + source.translation + '》' : '独立练习' }
function openRecent(item) { if (item.type === 'article') openArticle(item.index); else if (item.type === 'externalArticle') openExternalChapter(item.chapterIndex,item.seriesIndex); else if (item.type === 'word') openWord(item.index, true); else if (item.type === 'grammar') openGrammar(item.index); else if (item.type === 'puzzle') startPuzzle(item.index) }
function clearRecent() { recentItems.value = []; try { uni.removeStorageSync('readEnglishRecent'); uni.$emit('readEnglishRecentUpdate') } catch (_) {} }
function selectRecentCategory(category) { recentCategory.value = category; recentPageSize.value = 10; scrollTop.value = 0 }
function selectPuzzleFilter(filter) { puzzleFilter.value = filter; puzzlePageSize.value = 6; scrollTop.value = 1; nextTick(() => { scrollTop.value = 0 }) }
function loadMorePage() { if (view.value === 'recent' && recentPageSize.value < visibleRecentItems.value.length) recentPageSize.value += 10; if (view.value === 'puzzle' && puzzlePageSize.value < visiblePuzzleSets.value.length) puzzlePageSize.value += 6 }
function formatEnglish(text) { return text.replace(/([’'])(?=[a-z])/gi, '$1\u2060') }
function openOfficialSource(source) { if (!source.url) { toast('公众号文章链接暂不可用'); return }
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.openOfficialAccountArticle) wx.openOfficialAccountArticle({ url:source.url, fail:() => toast('暂时无法打开公众号文章') })
  else toast('请更新微信后再打开公众号文章')
  // #endif
  // #ifdef H5
  window.open(source.url, '_blank', 'noopener')
  // #endif
}
function wordStudyQuery() {
  if (dailyStudy.value) return '&study=daily&day=' + studyDate.value
  if (isExternalReading.value) return '&source=external&series=' + externalSeriesIndex.value + '&chapter=' + externalChapterIndex.value
  if (sourceArticleIndex.value >= 0) return '&article=' + sourceArticleIndex.value
  return ''
}
function go(next) {
  const routes = {home:'/pages/index/index',reading:'/pages/reading/index',article:'/pages/reading/article',questions:'/pages/reading/questions',vocab:'/pages/vocab/index',wordlist:'/pages/vocab/list',worddetail:'/pages/vocab/detail',spell:'/pages/vocab/spell',grammar:'/pages/grammar/index',gramlist:'/pages/grammar/index',gramdetail:'/pages/grammar/detail',gramquiz:'/pages/grammar/quiz',articlegramdetail:'/pages/reading/grammar',puzzle:'/pages/puzzle/index',puzzleplay:'/pages/puzzle/play',recent:'/pages/recent/index'}
  if (routes[next] && next !== props.initialView) {
    const item = ['article','questions','articlegramdetail'].includes(next) ? articleIndex.value : next === 'worddetail' ? wordIndex.value : next === 'spell' ? spellReturn.value === 'articlewordlist' ? articleIndex.value : wordIndex.value : ['gramdetail','gramquiz'].includes(next) ? grammarIndex.value : next === 'puzzleplay' ? puzzleSetIndex.value : 0
    const externalContext = isExternalReading.value ? '&source=external&series=' + externalSeriesIndex.value + '&chapter=' + externalChapterIndex.value : ''
    let extra = ''
    if (next === 'spell') extra = '&from=' + spellReturn.value + (spellReturn.value === 'worddetail' ? wordStudyQuery() : (spellReturn.value === 'articlewordlist' ? '&article=' + articleIndex.value : '') + (isExternalReading.value ? externalContext : ''))
    if (next === 'worddetail') extra = (wordReadOnly.value ? '&readonly=1' : '') + wordStudyQuery()
    if (next === 'puzzleplay') extra = '&sentence=' + puzzleIndex.value
    const source = isExternalReading.value && ['questions','articlegramdetail'].includes(next) ? externalContext : ''
    uni.navigateTo({url: routes[next] + '?item=' + item + extra + source})
    return
  }
  if (next === view.value) return
  viewStack.value.push(view.value)
  view.value = next
  if (['home','reading','vocab','grammar','puzzle'].includes(next)) activeTab.value = next
  scrollTop.value = 0
}
function back() { if (view.value === 'spell' && spellReturn.value === 'worddetail') { finishWordStep(''); return }; if (viewStack.value.length) { view.value = viewStack.value.pop(); if (['home','reading','vocab','grammar','puzzle'].includes(view.value)) activeTab.value = view.value } else if (props.initialView !== 'home') { uni.navigateBack({ fail: () => uni.redirectTo({url:'/pages/index/index'}) }); return } else { view.value = 'home'; activeTab.value = 'home' }; scrollTop.value = 0 }
function openArticle(i) { articleIndex.value = i; readingSource.value = 'article'; sourceArticleIndex.value = -1; questionIndex.value = 0; go('article') }
function openExternalSeries(i) { uni.navigateTo({url:'/pages/reading/series?item=' + i}) }
function openExternalChapter(i, seriesIndex = externalSeriesIndex.value) { uni.navigateTo({url:'/pages/reading/chapter?item=' + seriesIndex + '&chapter=' + i}) }
function goExternalChapter(i) { if (i < 0 || i >= currentExternalSeries.value.chapters.length) return; externalChapterIndex.value = i; scrollTop.value = 0 }
function completeReading() { if (readingCompleted.value) return; const article = currentArticle.value; readingCompletion.value = {...readingCompletion.value,[readingCompletionKey.value]:true}; try { uni.setStorageSync('readEnglishReadingCompletion', readingCompletion.value); uni.$emit('readEnglishReadingCompletionUpdate') } catch (_) {}; if (isExternalReading.value) trackRecent('externalArticle', externalChapterIndex.value, article.title, currentExternalSeries.value.translation + ' · 外刊阅读', {seriesIndex:externalSeriesIndex.value,chapterIndex:externalChapterIndex.value}); else trackRecent('article', articleIndex.value, article.title, article.translation + ' · 精读文章'); toast('阅读完成，已加入最近学习') }
function backToExternalDirectory() { uni.navigateBack({fail:() => uni.redirectTo({url:'/pages/reading/series?item=' + externalSeriesIndex.value})}) }
function openArticleWords() { const url = isExternalReading.value ? '/pages/vocab/list?source=external&series=' + externalSeriesIndex.value + '&chapter=' + externalChapterIndex.value : '/pages/vocab/list?article=' + articleIndex.value; uni.navigateTo({url}) }
function isFavorite(word) { return favoriteWordIds.value.includes(word) }
function toggleFavorite(word) { favoriteWordIds.value = isFavorite(word) ? favoriteWordIds.value.filter(id => id !== word) : [...favoriteWordIds.value, word]; try { uni.setStorageSync('readEnglishWordFavorites', favoriteWordIds.value); uni.$emit('readEnglishWordFavoritesUpdate') } catch (_) {} }
function isTodayWordDone(index) { return Boolean(dailyWordProgress.value[allWords[index].word]) }
function openFavoriteWords() { uni.navigateTo({url:'/pages/vocab/list'}) }
function openTodayWord() { const index = todayWordIndexes.value.find(index => !isTodayWordDone(index)) ?? todayWordIndexes.value[0]; if (index === undefined) return; studyDate.value = todayKey.value; openWord(index, false, true) }
function beginTodaySpelling() { const index = todayWordIndexes.value[0]; if (index === undefined) return; uni.navigateTo({url:'/pages/vocab/spell?from=today&study=daily&day=' + todayKey.value + '&item=' + index}) }
function openWord(i, readOnly = false, fromDaily = false) { wordIndex.value = i; wordReadOnly.value = readOnly; dailyStudy.value = fromDaily; scrollTop.value = 1; nextTick(() => { scrollTop.value = 0 }); go('worddetail') }
function completeWordAfterSpelling(word) { if (spellReturn.value !== 'worddetail') return; const completedIndex = allWords.findIndex(entry => entry.word === word.word); if (completedIndex < 0) return; if (!wordCompletion.value[word.word]) { wordCompletion.value = {...wordCompletion.value,[word.word]:true}; try { uni.setStorageSync('readEnglishWordCompletion',wordCompletion.value); uni.$emit('readEnglishWordCompletionUpdate') } catch (_) {} } if (dailyStudy.value && studyWordIndexes.value.includes(completedIndex)) { const updated = {...loadDailyWordProgress(studyDate.value), [word.word]:true}; try { uni.setStorageSync('readEnglishDailyWordProgress:' + studyDate.value, updated); uni.$emit('readEnglishDailyWordProgressUpdate') } catch (_) {}; if (studyDate.value === todayKey.value) dailyWordProgress.value = updated } trackRecent('word',completedIndex,word.word,word.pos + ' ' + word.meaning) }
function showPuzzleGuide() { uni.showModal({title:'拼句练习',content:'根据中文意思，点选词块组成英文句子。每完成一句会自动保存进度；想重新练习，可在练习列表点击「从头开始」。',showCancel:false,confirmText:'知道了'}) }
function openGrammar(i) { grammarIndex.value = i; const item = grammarItems[i] || grammarItems[0]; trackRecent('grammar', i, item.title, item.level + ' · 语法专题'); go('gramdetail') }
function startQuestions() { questionIndex.value = 0; selectedOption.value = -1; answered.value = false; fillAnswer.value = ''; go('questions') }
function chooseOption(i) { if (!answered.value) selectedOption.value = i }
function optionState(i) { if (!answered.value) return selectedOption.value === i ? 'chosen-option' : ''; if (i === currentQuestion.value.answer) return 'correct-option'; if (i === selectedOption.value) return 'wrong-option'; return '' }
function questionAction() { if (!answered.value) { if (selectedOption.value < 0 && !fillAnswer.value.trim()) { toast('先选择或填写答案'); return }; const q = currentQuestion.value; isCorrect.value = q.kind === 'choice' ? selectedOption.value === q.answer : fillAnswer.value.trim().toLowerCase() === q.answer.toLowerCase(); answered.value = true } else if (questionIndex.value < currentArticle.value.questions.length - 1) { questionIndex.value++; selectedOption.value = -1; answered.value = false; fillAnswer.value = '' } else { toast('阅读理解完成'); back() } }
function beginSpelling(from) { spellReturn.value = from; spellWords.value = from === 'worddetail' ? [currentWord.value] : from === 'articlewordlist' ? visibleWordList.value : allWords; spellIndex.value = 0; setupSpell(); go('spell') }
function setupSpell() { const answer = spellWords.value[spellIndex.value].word.toLowerCase(); spellSlots.value = Array(answer.length).fill(''); const chars = answer.split(''); letterBank.value = [...chars].sort(() => Math.random() - .5); usedLetters.value = []; answered.value = false; isCorrect.value = false; spellChecked.value = false }
function addLetter(i) { if (usedLetters.value.includes(i) || answered.value) return; const empty = spellSlots.value.indexOf(''); if (empty < 0) return; spellSlots.value[empty] = letterBank.value[i]; usedLetters.value.push(i); spellChecked.value = false }
function removeLetter(i) { if (answered.value || !spellSlots.value[i]) return; const char = spellSlots.value[i]; const bankIndex = letterBank.value.findIndex((c,j) => c === char && usedLetters.value.includes(j)); if (bankIndex >= 0) usedLetters.value = usedLetters.value.filter(j => j !== bankIndex); spellSlots.value[i] = ''; spellChecked.value = false }
function finishWordStep(nextUrl) {
  const pages = getCurrentPages()
  let sourceIndex = -1
  for (let i = pages.length - 1; i >= 0; i--) {
    if (!['pages/vocab/detail','pages/vocab/spell'].includes((pages[i].route || '').replace(/^\//,''))) { sourceIndex = i; break }
  }
  const fallbackUrl = nextUrl || '/pages/vocab/index'
  if (sourceIndex < 0) { uni.reLaunch({url:fallbackUrl}); return }
  uni.navigateBack({
    delta:pages.length - 1 - sourceIndex,
    success:() => { if (nextUrl) setTimeout(() => uni.navigateTo({url:nextUrl}), 120) },
    fail:() => uni.reLaunch({url:fallbackUrl})
  })
}
function syncNextWord({from, to}) {
  if (view.value !== 'worddetail' || wordIndex.value !== from || wordReadOnly.value) return
  wordIndex.value = to
  scrollTop.value = 1
  nextTick(() => { scrollTop.value = 0 })
}
function advanceToNextWord() {
  const nextIndex = nextStudyWordIndex.value
  const nextUrl = '/pages/vocab/detail?item=' + nextIndex + wordStudyQuery()
  const pages = getCurrentPages()
  const previousRoute = (pages[pages.length - 2]?.route || '').replace(/^\//,'')
  if (previousRoute !== 'pages/vocab/detail') {
    finishWordStep(nextUrl)
    return
  }
  uni.$emit('readEnglishAdvanceWord', {from:wordIndex.value, to:nextIndex})
  uni.navigateBack({
    delta:1,
    success:() => {
      // #ifdef H5
      setTimeout(() => {
        if (window.location.hash.startsWith('#/pages/vocab/detail')) window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + '#' + nextUrl)
      }, 80)
      // #endif
    },
    fail:() => uni.redirectTo({url:nextUrl})
  })
}
function spellAction() {
  if (!answered.value) {
    if (spellSlots.value.includes('')) { toast('请先填完所有字母'); return }
    isCorrect.value = spellSlots.value.join('') === spellWords.value[spellIndex.value].word.toLowerCase()
    spellChecked.value = true
    answered.value = isCorrect.value
    if (isCorrect.value) completeWordAfterSpelling(spellWords.value[spellIndex.value])
    return
  }
  if (spellReturn.value === 'worddetail') {
    if (nextStudyWordIndex.value >= 0) advanceToNextWord()
    else finishWordStep('')
    return
  }
  if (spellIndex.value < spellWords.value.length - 1) { spellIndex.value++; setupSpell(); return }
  toast('拼写练习完成')
  const fallbackUrl = spellReturn.value === 'today' ? '/pages/vocab/index' : spellReturn.value === 'articlewordlist' && isExternalReading.value ? '/pages/vocab/list?source=external&series=' + externalSeriesIndex.value + '&chapter=' + externalChapterIndex.value : spellReturn.value === 'articlewordlist' ? '/pages/vocab/list?article=' + sourceArticleIndex.value : '/pages/vocab/list'
  uni.navigateBack({fail:() => uni.redirectTo({url:fallbackUrl})})
}
function chooseGrammar(i) { if (grammarAnswered.value) return; selectedOption.value = i }
function startGrammarQuiz() { selectedOption.value = -1; grammarAnswered.value = false; go('gramquiz') }
function grammarQuizAction() { if (!grammarAnswered.value) { if (selectedOption.value < 0) { toast('先选择一个答案'); return }; grammarCorrect.value = selectedOption.value === currentGrammar.value.quiz.answer; grammarAnswered.value = true } else { back() } }
function pickPuzzle(i) { if (usedPuzzle.value.includes(i) || puzzleAnswered.value) return; puzzleWords.value.push(shuffledPuzzle.value[i]); usedPuzzle.value.push(i); puzzleChecked.value = false }
function unpickPuzzle(i) { if (puzzleAnswered.value) return; const word = puzzleWords.value[i]; puzzleWords.value.splice(i,1); const bankIndex = usedPuzzle.value.find(j => shuffledPuzzle.value[j] === word); if (bankIndex !== undefined) usedPuzzle.value = usedPuzzle.value.filter(j => j !== bankIndex); puzzleChecked.value = false }
function savePuzzleProgress(setIndex, cursor, completed = false) { const set = puzzleSets[setIndex]; if (!set) return; puzzleProgress.value = persistPuzzleProgress(puzzleProgress.value, set, cursor, completed); trackRecent('puzzle',setIndex,set.title,set.subtitle + ' · 拼句练习',{puzzleCursor:cursor,puzzleTotal:set.items.length,puzzleCompleted:completed}) }
function startPuzzle(i, fromStart = false) { puzzleSetIndex.value = ((i % puzzleSets.length) + puzzleSets.length) % puzzleSets.length; const set = puzzleSets[puzzleSetIndex.value]; try { puzzleProgress.value = uni.getStorageSync('readEnglishPuzzleProgress') || {} } catch (_) {}; const saved = puzzleProgress.value[set.id] || {cursor:0,completed:false}; const cursor = fromStart || saved.completed ? 0 : Math.min(saved.cursor || 0,set.items.length - 1); puzzleIndex.value = cursor; savePuzzleProgress(puzzleSetIndex.value,cursor,false); initPuzzle(); go('puzzleplay') }
function puzzleAction() { if (puzzleAnswered.value) { if (puzzleIndex.value < currentPuzzleSet.value.items.length - 1) { puzzleIndex.value++; initPuzzle() } else { toast('这组练习完成'); back() }; return }; if (puzzleWords.value.length !== shuffledPuzzle.value.length) { toast('先把所有单词拼完'); return }; puzzleCorrect.value = puzzleWords.value.join(' ') === puzzle.value.answer; puzzleChecked.value = true; if (!puzzleCorrect.value) return; puzzleAnswered.value = true; const nextCursor = puzzleIndex.value + 1; savePuzzleProgress(puzzleSetIndex.value,nextCursor,nextCursor === currentPuzzleSet.value.items.length) }
function initPuzzle() { shuffledPuzzle.value = puzzle.value.answer.split(' ').sort(() => Math.random() - .5); puzzleWords.value = []; usedPuzzle.value = []; puzzleAnswered.value = false; puzzleChecked.value = false; puzzleCorrect.value = false }
if (props.initialView === 'spell') setupSpell()
else initPuzzle()
let dayRefreshTimer
onMounted(() => { hintPageActive = true; uni.$on('readEnglishRecentUpdate', syncRecentItems); uni.$on('readEnglishReadingCompletionUpdate', syncReadingCompletion); uni.$on('readEnglishWordCompletionUpdate', syncWordCompletion); uni.$on('readEnglishWordFavoritesUpdate', syncFavoriteWords); uni.$on('readEnglishDailyWordProgressUpdate', syncDailyWordProgress); uni.$on('readEnglishPuzzleProgressUpdate', syncPuzzleProgress); uni.$on('readEnglishAdvanceWord', syncNextWord); dayRefreshTimer = setInterval(refreshToday, 60000) })
onUnmounted(() => { hintPageActive = false; pendingHint = null; clearInterval(dayRefreshTimer); uni.$off('readEnglishRecentUpdate', syncRecentItems); uni.$off('readEnglishReadingCompletionUpdate', syncReadingCompletion); uni.$off('readEnglishWordCompletionUpdate', syncWordCompletion); uni.$off('readEnglishWordFavoritesUpdate', syncFavoriteWords); uni.$off('readEnglishDailyWordProgressUpdate', syncDailyWordProgress); uni.$off('readEnglishPuzzleProgressUpdate', syncPuzzleProgress); uni.$off('readEnglishAdvanceWord', syncNextWord) })
</script>


