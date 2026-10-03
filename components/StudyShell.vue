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
    <scroll-view class="page-scroll" scroll-y :scroll-top="scrollTop" :show-scrollbar="false" lower-threshold="100" @scrolltolower="loadMoreRecent">
      <view v-if="view === 'home'" class="page home-page">
        <view class="hero">
          <view class="hero-copy"><text class="eyebrow">READ · LEARN · GROW</text><text class="hero-title">把英语，读进生活里</text><text class="hero-sub">从一个故事开始，慢慢读懂英文。</text></view>
          <view class="book-art"><text>读</text><text class="book-mark">READ</text></view>
          <view class="hero-orb"></view>
        </view>
        <view class="section-head"><text class="section-title">自由选择学习模块</text><text class="section-note">想学什么，就从这里开始</text></view>
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
        <view v-else class="card recent-empty"><text class="card-title">你的学习记录会显示在这里</text><text class="card-sub">读一篇短文，或打开任意词条开始学习。</text></view>
      </view>

      <view v-else-if="view === 'reading'" class="page reading-page">
        <view class="tabs"><view class="design-tab" :class="{on: readingShelf === 'easy'}" @tap="readingShelf='easy'">轻松阅读</view><view class="design-tab" :class="{on: readingShelf === 'mag'}" @tap="readingShelf='mag'">外刊</view></view>
        <view v-if="readingShelf === 'easy'">
          <view class="filters"><text v-for="f in ['全部','初级','高级']" :key="f" class="filter" :class="{on: readingFilter === f}" @tap="readingFilter=f">{{ f }}</text></view>
          <view class="article-list"><view v-for="article in filteredArticles" :key="article.id" class="article" @tap="openArticle(articles.indexOf(article))"><view class="art" :class="article.theme"><text>{{ article.icon }}</text></view><view class="article-info"><text class="design-article-title">{{ article.translation }}</text><text class="design-article-desc">{{ article.title }}</text><view class="tags"><text class="tag">原创故事</text><text class="tag">{{ article.level }}</text><text class="tag">{{ storyWordCounts[articles.indexOf(article)] }} 词</text></view></view><text class="arr">›</text></view></view>
        </view>
        <view v-else class="shelf external-shelf"><view class="external-intro"><text class="eyebrow">READING COLLECTION</text><text class="external-heading">外刊小说</text><text class="muted">从一段故事出发，读懂英文与世界</text></view><view v-for="(series,i) in externalSeries" :key="series.id" class="mag external-book" @tap="openExternalSeries(i)"><view class="mag-cover" :class="series.theme"><view class="cover-sun"></view><view class="cover-hill hill-back"></view><view class="cover-hill hill-front"></view><view class="cover-art">{{ series.icon }}</view><text class="cover-kicker">A SHORT STORY</text><text class="cover-title">{{ series.title }}</text><text class="cover-label">{{ series.level }} · {{ series.chapters.length }} 章</text></view><text class="mag-name">{{ series.translation }}</text><text class="mag-note">{{ series.description }}</text><text class="external-author">{{ series.author }}</text></view></view>
      </view>

      <view v-else-if="view === 'externalchapters'" class="page external-directory"><view class="series-overview"><view class="directory-cover" :class="currentExternalSeries.theme"><view class="directory-sun"></view><view class="directory-wave wave-one"></view><view class="directory-wave wave-two"></view><text class="directory-cover-icon">{{ currentExternalSeries.icon }}</text><text class="directory-cover-title">{{ currentExternalSeries.title }}</text></view><view class="series-copy"><text class="eyebrow">{{ currentExternalSeries.level }} · {{ currentExternalSeries.chapters.length }} CHAPTERS</text><text class="series-title">{{ currentExternalSeries.translation }}</text><text class="series-original">{{ currentExternalSeries.title }}</text><text class="series-description">{{ currentExternalSeries.description }}</text></view></view><view class="directory-heading"><text class="directory-heading-mark">目录</text><text class="directory-count">{{ currentExternalSeries.chapters.length }} 章</text></view><view class="chapter-list"><view v-for="(chapter,i) in currentExternalSeries.chapters" :key="chapter.title" class="chapter-row" @tap="openExternalChapter(i)"><text class="chapter-number">{{ String(i+1).padStart(2,'0') }}</text><view class="chapter-copy"><text class="chapter-title">{{ chapter.title }}</text><text class="chapter-meta">{{ chapter.translations[0] }}</text></view><view class="chapter-arrow">›</view></view></view><view class="external-source-note">原创分级读物 · 共 {{ currentExternalSeries.chapters.length }} 个章节</view></view>

      <view v-else-if="view === 'externalchapter'" class="page external-reading"><view class="reading-series-label"><text>{{ currentExternalSeries.translation }}</text><text>第 {{ externalChapterIndex + 1 }} 章 / {{ currentExternalSeries.chapters.length }}</text></view><text class="external-chapter-title">{{ currentExternalChapter.title }}</text><view class="chapter-reading-meta"><text>{{ currentExternalSeries.level }}</text><text>约 {{ currentExternalChapter.minutes }} 分钟</text><text>{{ currentExternalChapter.paragraphs.length }} 段</text></view><view class="reading-tools"><text class="reading-progress-label">本章阅读</text><text class="translation-toggle" @tap="showExternalTranslations = !showExternalTranslations">{{ showExternalTranslations ? '隐藏译文' : '显示译文' }}　{{ showExternalTranslations ? '−' : '+' }}</text></view><view class="reading-progress-track"><view class="reading-progress-fill" :style="{width: ((externalChapterIndex + 1) / currentExternalSeries.chapters.length * 100) + '%'}"></view></view><view class="external-paragraphs"><view v-for="(paragraph,p) in currentExternalChapter.paragraphs" :key="p" class="external-paragraph"><view class="paragraph-number">{{ String(p+1).padStart(2,'0') }}</view><view class="paragraph-content"><text v-for="(sentence,s) in paragraph" :key="s" class="external-sentence">{{ sentence }}{{ s < paragraph.length - 1 ? ' ' : '' }}</text><text v-if="showExternalTranslations" class="external-translation">{{ currentExternalChapter.translations[p] }}</text></view></view></view><view class="chapter-navigation"><button class="secondary-button" :disabled="externalChapterIndex === 0" @tap="goExternalChapter(externalChapterIndex - 1)">上一章</button><button class="primary-button" v-if="externalChapterIndex < currentExternalSeries.chapters.length - 1" @tap="goExternalChapter(externalChapterIndex + 1)">下一章</button><button class="primary-button" v-else @tap="backToExternalDirectory">返回目录</button></view></view>

      <view v-else-if="view === 'article'" class="page article-page">
        <view v-if="isExternalReading" class="article-source-kicker">{{ currentExternalSeries.translation }}　·　第 {{ externalChapterIndex + 1 }} 章</view>
        <view class="article-heading"><text class="eyebrow">{{ currentArticle.level }}　·　{{ currentArticle.minutes }} MIN READ</text><text class="large-title">{{ currentArticle.title }}</text><text class="article-translation">{{ currentArticle.translation }}</text></view>
        <view class="story-banner" :class="currentArticle.theme"><text class="story-emoji">{{ currentArticle.icon }}</text><text class="story-banner-title">{{ currentArticle.title }}</text><text class="story-banner-caption">A short story for thoughtful reading</text></view>
        <view class="reading-text"><view v-for="(paragraph, p) in currentArticle.paragraphs" :key="p" class="paragraph"><text v-for="(sentence, s) in paragraph" :key="s" class="sentence">{{ formatEnglish(sentence) }}{{ s < paragraph.length - 1 ? '\u00a0' : '' }}</text><text class="translation-line">{{ currentArticle.translations[p] }}</text></view></view>
        <view class="section-head"><text class="section-title">本文配套学习</text><text class="section-note">围绕这篇文章单独整理</text></view>
        <view class="learning-links"><view class="learning-link" @tap="openArticleWords"><view class="mini-icon gold">Aa</view><view><text class="card-title">本文重点词汇</text><text class="card-sub">{{ articleWordEntries.length }} 个词条 · 点词进入完整详解</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="go('articlegramlist')"><view class="mini-icon lilac">文</view><view><text class="card-title">本文语法解析</text><text class="card-sub">{{ currentArticleGrammar.length }} 个针对本文的语法点</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="startQuestions"><view class="mini-icon blue">✓</view><view><text class="card-title">阅读理解</text><text class="card-sub">{{ currentArticle.questions.length }} 道围绕本文的理解练习</text></view><text class="chevron">›</text></view></view>
        <view class="reading-completion"><button class="primary-button" :class="{'reading-done':readingCompleted}" @tap="completeReading">{{ readingCompleted ? '✓ 已完成阅读' : '阅读完成' }}</button><text class="completion-note">{{ readingCompleted ? '这篇文章已计入学习记录' : '点击后记录本篇阅读进度' }}</text></view><view class="bottom-spacer"></view>
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
        <view class="vocab-intro"><text class="eyebrow">VOCABULARY</text><text class="large-title">每天几个词，慢慢学扎实</text><text class="muted">今日词单每天更新，学过的词可在记录中重看</text></view>
        <view class="card today-word-card"><view class="today-card-top"><view><text class="today-label">TODAY'S WORDS</text><text class="today-title">今日单词</text></view><text class="today-date">{{ todayDateLabel }}</text></view><text class="today-description">先读懂词义，再动手拼写</text><view class="today-progress-row"><text>已完成 {{ todayCompletedCount }} / {{ todayWordIndexes.length }}</text><text>{{ todayCompletedCount === todayWordIndexes.length ? '今日已学完' : '明天将更新新词单' }}</text></view><view class="progress-track"><view class="progress-fill" :style="{width: todayProgressPercent + '%'}"></view></view><view class="today-preview"><text v-for="index in todayWordIndexes" :key="index" class="today-chip" :class="{'today-chip-done': isTodayWordDone(index)}">{{ allWords[index].word }}<text v-if="isTodayWordDone(index)"> ✓</text></text></view><button class="primary-button" @tap="openTodayWord">{{ todayCompletedCount === todayWordIndexes.length ? '再学一遍今日单词' : todayCompletedCount ? '继续今日学习' : '开始今日学习' }}</button></view>
        <view class="card favorite-entry" @tap="openFavoriteWords"><text class="shortcut-symbol shortcut-star">★</text><view class="favorite-entry-copy"><text class="shortcut-title">我的收藏</text><text class="shortcut-meta">已收藏 {{ favoriteWords.length }} 个单词，随时回来看</text></view><text class="shortcut-arrow">›</text></view>
        <view class="section-head"><text class="section-title">最近学习</text><text class="section-note">点单词查看完整详解</text></view>
        <view v-if="recentWords.length" class="word-list"><view v-for="item in recentWords" :key="item.key" class="card word-row" @tap="openWord(item.index, true)"><view><text class="word-main">{{ allWords[item.index].word }}</text><text class="word-sub">{{ allWords[item.index].pos }}　{{ allWords[item.index].meaning }}</text></view><text class="chevron">›</text></view></view>
        <view v-else class="card word-empty"><text class="card-title">还没有学完的单词</text><text class="card-sub">完成今日单词的拼写后，学习记录会显示在这里。</text><text class="inline-link" @tap="openTodayWord">开始今日学习　›</text></view>
      </view>

      <view v-else-if="view === 'wordlist'" class="page"><view class="intro-block"><text class="eyebrow">{{ isScopedArticle ? 'ARTICLE WORDS' : 'SAVED WORDS' }}</text><text class="large-title">{{ isScopedArticle ? currentArticle.translation + ' · 重点词汇' : '我的收藏' }}</text><text class="muted">{{ isScopedArticle ? '读懂词义，再完成拼写；学完后可继续本文下一词' : '点星星收藏的单词都在这里，随时回来看看' }}</text></view><view v-if="visibleWordList.length" class="word-list"><view v-for="word in visibleWordList" :key="word.word" class="card word-row" @tap="openWord(allWords.indexOf(word), !isScopedArticle)"><view><text class="word-main">{{ word.word }}</text><text class="word-sub">{{ word.pos }}　{{ word.meaning }}</text></view><text v-if="wordCompletion[word.word]" class="row-learned">已学完</text><text v-if="isFavorite(word.word)" class="row-favorite">★</text><text class="chevron">›</text></view></view><view v-else class="card word-empty"><text class="card-title">还没有收藏单词</text><text class="card-sub">在单词详解页点亮星星，喜欢的单词会出现在这里。</text><text class="inline-link" @tap="back">返回今日单词　›</text></view></view>

      <view v-else-if="view === 'worddetail'" class="page word-detail-page"><view class="word-hero"><view class="word-hero-top"><view class="word-source"><text class="eyebrow">{{ dailyStudy ? '今日单词' : isScopedArticle ? isExternalReading ? '本章重点词汇' : '本文重点词汇' : '单词详解' }}</text><text v-if="dailyStudy || isScopedArticle" class="word-source-progress">{{ dailyStudy ? todayStudyPosition + 1 : scopedWordPosition + 1 }}/{{ dailyStudy ? studyWordIndexes.length : scopedWordIndexes.length }}</text></view><text class="favorite-toggle" :class="{active:isFavorite(currentWord.word)}" @tap="toggleFavorite(currentWord.word)">{{ isFavorite(currentWord.word) ? '★' : '☆' }}</text></view><text class="word-display">{{ currentWord.word }}</text><view class="pronounce-row"><text class="pronunciation">{{ currentWord.ipa }}</text></view><view class="word-badges"><text class="tag">{{ currentWord.pos }}</text><text class="tag">{{ currentWord.frequency }}</text><text v-if="dailyStudy && isCurrentWordLearned && !isCurrentTodayWordDone" class="tag prior-learned-tag">曾学过 · 今日待练</text><text v-else-if="isCurrentWordLearned" class="tag learned-tag">✓ 已学完</text></view><text class="meaning">{{ currentWord.meaning }}</text></view>
        <view v-if="currentWordContent.type === 'officialAccount'" class="card source-card"><text class="detail-label">公众号文章</text><text class="card-title">{{ currentWordContent.title || '查看关联的公众号文章' }}</text><text class="card-sub">{{ currentWordContent.summary || '词汇详解内容来自关联的公众号文章。' }}</text><button class="source-button" @tap="openOfficialSource(currentWordContent)">阅读公众号原文</button></view><rich-text v-else class="rich-content card" :nodes="currentWordContent.html" />
      </view>

      <view v-else-if="view === 'spell'" class="page spell-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: spellProgressPercent + '%'}"></view></view></view><view class="spell-prompt"><text class="eyebrow">根据中文释义拼出单词</text><text class="spell-meaning">{{ spellWords[spellIndex].pos }}　{{ spellWords[spellIndex].meaning }}</text><text class="hint-link" @tap="requestAnswerHint('spell')">需要提示？</text></view><view class="card spelling-card"><view class="letter-slots"><view v-for="(letter,i) in spellSlots" :key="i" class="letter-slot" :class="{ 'answer-correct': spellChecked && letter === spellWords[spellIndex].word.toLowerCase()[i], 'answer-wrong': spellChecked && letter !== spellWords[spellIndex].word.toLowerCase()[i] }" @tap="removeLetter(i)">{{ letter || '' }}</view></view><view class="letter-bank"><button v-for="(letter,i) in letterBank" :key="i" class="letter-key" :disabled="usedLetters.includes(i) || answered" @tap="addLetter(i)">{{ letter }}</button></view><view v-if="spellChecked" class="explanation" :class="{ 'feedback-wrong': !isCorrect }"><text class="explanation-title">{{ isCorrect ? (spellReturn === 'worddetail' ? '拼写正确，本词已学完！' : '拼写正确！') : '标红的字母位置不对，调整后再试' }}</text><text v-if="isCorrect" class="explanation-text">{{ spellWords[spellIndex].word }}　{{ spellWords[spellIndex].meaning }}</text></view></view><view class="bottom-action"><button class="primary-button" @tap="spellAction">{{ spellActionLabel }}</button></view></view>

      <view v-else-if="view === 'grammar' || view === 'gramlist'" class="page grammar-page">
        <view class="hero-home grammar-home-hero"><view class="eyebrow">GRAMMAR NOTES</view><text class="grammar-hero-title">理解规则，<br/>再把句子说清楚。</text><text class="grammar-hero-sub">选知识点，自由开始学习</text><view class="hero-book grammar-book">文</view></view>
        <view class="filters grammar-filters"><text v-for="f in ['全部','基础','时态','句型']" :key="f" class="filter" :class="{on: grammarFilter === f}" @tap="grammarFilter=f">{{ f }}</text></view>
        <view class="grammarlist"><view v-for="(item,i) in visibleGrammar" :key="item.title" class="gramrow" @tap="openGrammar(item.sourceIndex)"><view class="gramicon">{{ ['时','让','时','句'][item.sourceIndex % 4] }}</view><view class="gramrow-copy"><text class="gramrow-title">{{ item.title }}</text><text class="gramrow-sub">{{ item.level }}　·　讲解与练习</text></view><text class="arr">›</text></view></view>
      </view>

      <view v-else-if="view === 'articlegramlist'" class="page"><view class="intro-block"><text class="eyebrow">ARTICLE GRAMMAR</text><text class="large-title">{{ currentArticle.translation }} · 语法解析</text><text class="muted">从本文句子出发，单独讲清对应语法</text></view><view v-for="(item,i) in currentArticleGrammar" :key="i" class="gramrow" @tap="openArticleGrammar(i)"><view class="gramicon">文</view><view class="gramrow-copy"><text class="gramrow-title">{{ item.title }}</text><text class="gramrow-sub">{{ item.summary }}</text></view><text class="arr">›</text></view></view>

      <view v-else-if="view === 'articlegramdetail'" class="page"><view class="grammar-hero"><text class="eyebrow">ARTICLE GRAMMAR</text><text class="large-title">{{ currentArticleGrammarNote.title }}</text><text class="muted">{{ currentArticleGrammarNote.summary }}</text></view><rich-text class="rich-content card" :nodes="articleGrammarContent.html" /><view class="article-source-note">解析来源：{{ currentArticle.title }}</view></view>

      <view v-else-if="view === 'gramdetail'" class="page"><view class="grammar-hero"><text class="eyebrow">GRAMMAR NOTE</text><text class="large-title">{{ currentGrammar.title }}</text><text class="muted">{{ currentGrammar.summary }}</text></view><view v-if="currentGrammarContent.type === 'officialAccount'" class="card source-card"><text class="detail-label">公众号文章</text><text class="card-title">{{ currentGrammarContent.title || '查看关联的公众号文章' }}</text><text class="card-sub">{{ currentGrammarContent.summary || '语法详解内容来自关联的公众号文章。' }}</text><button class="source-button" @tap="openOfficialSource(currentGrammarContent)">阅读公众号原文</button></view><rich-text v-else class="rich-content card" :nodes="currentGrammarContent.html" /><view class="bottom-action"><button class="primary-button" @tap="startGrammarQuiz">做几道练习</button></view></view>

      <view v-else-if="view === 'gramquiz'" class="page question-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: (grammarAnswered ? '100%' : '35%')}"></view></view><text class="muted">练习</text></view><text class="question-type">语法小练习</text><text class="question-title">{{ currentGrammar.quiz.prompt }}</text><view class="option-list"><view v-for="(option,i) in currentGrammar.quiz.options" :key="i" class="option-card" :class="optionState(i)" @tap="chooseGrammar(i)"><text class="option-letter">{{ String.fromCharCode(65+i) }}</text><text>{{ option }}</text><text v-if="grammarAnswered && i === currentGrammar.quiz.answer" class="option-check">✓</text></view></view><view v-if="grammarAnswered" class="explanation"><text class="explanation-title">{{ grammarCorrect ? '回答正确' : '看看解析' }}</text><text class="explanation-text">{{ currentGrammar.quiz.explanation }}</text></view><view class="bottom-action"><button class="primary-button" @tap="grammarQuizAction">{{ grammarAnswered ? '返回语法解析' : '确认答案' }}</button></view></view>

      <view v-else-if="view === 'puzzle'" class="page puzzle-page">
        <view class="hero-home puzzle-home-hero"><view class="eyebrow">SENTENCE PUZZLE</view><text class="puzzle-hero-title">读懂中文，<br/>重新排好英文。</text><text class="puzzle-hero-sub">独立题库，自由选择主题练习</text><view class="hero-book puzzle-book">拼</view></view>
        <view v-if="articlePuzzleSets.length"><view class="section-head"><text class="section-title">精读文章配套</text><text class="section-note">可选关联文章内容</text></view><view v-for="set in articlePuzzleSets" :key="set.id" class="card puzzle-source-card"><view class="puzzle-source" @tap="startPuzzle(set.setIndex)"><view class="thumb puzzle-thumb">{{ set.icon }}</view><view class="puzzle-source-copy"><text class="card-title">{{ set.title }}</text><text class="card-sub">{{ puzzleSourceLabel(set) }}　·　{{ set.items.length }} 句</text><text v-if="puzzleProgressFor(set).cursor || puzzleProgressFor(set).completed" class="puzzle-set-status">{{ puzzleProgressFor(set).completed ? '已完成全部 ' + set.items.length + ' 句' : '已完成 ' + puzzleProgressFor(set).cursor + ' / ' + set.items.length + ' 句' }}</text></view><text class="arr">›</text></view><view v-if="puzzleProgressFor(set).cursor || puzzleProgressFor(set).completed" class="puzzle-set-actions"><text class="puzzle-set-continue" @tap.stop="startPuzzle(set.setIndex)">{{ puzzleProgressFor(set).completed ? '再练一次' : '继续练习' }}</text><text class="puzzle-set-restart" @tap.stop="startPuzzle(set.setIndex,true)">从头开始</text></view></view></view>
        <view class="section-head"><text class="section-title">独立练习</text><text class="section-note">无需先读文章</text></view><view v-for="set in independentPuzzleSets" :key="set.id" class="card puzzle-source-card"><view class="puzzle-source" @tap="startPuzzle(set.setIndex)"><view class="thumb puzzle-thumb">{{ set.icon }}</view><view class="puzzle-source-copy"><text class="card-title">{{ set.title }}</text><text class="card-sub">{{ set.subtitle }}　·　{{ set.items.length }} 句</text><text v-if="puzzleProgressFor(set).cursor || puzzleProgressFor(set).completed" class="puzzle-set-status">{{ puzzleProgressFor(set).completed ? '已完成全部 ' + set.items.length + ' 句' : '已完成 ' + puzzleProgressFor(set).cursor + ' / ' + set.items.length + ' 句' }}</text></view><text class="arr">›</text></view><view v-if="puzzleProgressFor(set).cursor || puzzleProgressFor(set).completed" class="puzzle-set-actions"><text class="puzzle-set-continue" @tap.stop="startPuzzle(set.setIndex)">{{ puzzleProgressFor(set).completed ? '再练一次' : '继续练习' }}</text><text class="puzzle-set-restart" @tap.stop="startPuzzle(set.setIndex,true)">从头开始</text></view></view>
      </view>
      <view v-else-if="view === 'puzzleplay'" class="page puzzleplay-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: ((puzzleIndex + (puzzleAnswered ? 1 : 0)) / currentPuzzleSet.items.length * 100) + '%'}"></view></view><text class="muted">{{ puzzleIndex + 1 }} / {{ currentPuzzleSet.items.length }}</text></view><text class="question-type">{{ currentPuzzleSet.title }}</text><text class="puzzle-cn">{{ puzzle.cn }}</text><text class="hint-link puzzle-hint" @tap="requestAnswerHint('puzzle')">需要提示？</text><view class="placed-words"><text v-if="!puzzleWords.length" class="muted">点选下方单词，组成正确句子</text><view v-for="(word,i) in puzzleWords" :key="i" class="word-token chosen" :class="{ 'answer-correct': puzzleChecked && word === puzzle.answer.split(' ')[i], 'answer-wrong': puzzleChecked && word !== puzzle.answer.split(' ')[i] }" @tap="unpickPuzzle(i)">{{ word }}</view></view><view class="word-bank"><view v-for="(word,i) in shuffledPuzzle" :key="i" class="word-token" :class="{used: usedPuzzle.includes(i)}" @tap="pickPuzzle(i)">{{ word }}</view></view><view v-if="puzzleChecked" class="explanation" :class="{ 'feedback-wrong': !puzzleCorrect }"><text class="explanation-title">{{ puzzleCorrect ? '语序正确！' : '标红的词块位置不对，调整后再试' }}</text><text v-if="puzzleCorrect" class="explanation-text">{{ puzzle.answer }}</text></view><view class="bottom-action"><button class="primary-button" @tap="puzzleAction">{{ puzzleAnswered ? (puzzleIndex < currentPuzzleSet.items.length - 1 ? '下一句' : '完成练习') : '检查答案' }}</button></view></view>

      <view v-else-if="view === 'recent'" class="page recent-page"><view class="intro-block"><text class="eyebrow">YOUR LEARNING</text><text class="large-title">最近学习</text><text class="muted">各模块分别保存，想学哪项就接着学</text></view><view class="recent-category-tabs"><view v-for="category in recentCategories" :key="category.id" class="recent-category" :class="{active:recentCategory===category.id}" @tap="selectRecentCategory(category.id)"><text>{{ category.label }}</text><text class="recent-count">{{ category.items.length }}</text></view></view><view v-if="visibleRecentItems.length" class="recent-section"><view v-for="item in pagedRecentItems" :key="item.key" class="card recent-entry" @tap="openRecent(item)"><view class="mini-icon" :class="recentTone(item.type)">{{ recentIcon(item.type) }}</view><view class="recent-copy"><text class="card-title">{{ item.title }}</text><text class="card-sub">{{ recentSubtitle(item) }}</text><view v-if="item.type==='puzzle'" class="puzzle-progress-track"><view class="puzzle-progress-fill" :style="{width:puzzleProgressPercent(item)+'%'}"></view></view></view><text v-if="item.type!=='puzzle'" class="chevron">›</text><view v-else class="puzzle-recent-actions"><text class="resume-puzzle" @tap.stop="openRecent(item)">{{ item.puzzleCompleted ? '再练一次' : '继续' }}</text><text class="restart-puzzle" @tap.stop="startPuzzle(item.index,true)">从头开始</text></view></view><view class="recent-load-more"><text v-if="visibleRecentItems.length > pagedRecentItems.length">继续下滑加载更多</text><text v-else>已经到底啦</text></view><text class="clear-history" @tap="clearRecent">清空最近学习记录</text></view><view v-else class="recent-empty"><view class="empty-illustration"><view class="empty-book">▤</view><view class="empty-spark spark-one">✦</view><view class="empty-spark spark-two">✧</view><view class="empty-orbit"></view></view><text class="empty-title">{{ recentEmptyTitle }}</text><text class="empty-description">{{ recentEmptyDescription }}</text><view class="empty-tip"><text class="empty-tip-icon">✦</text><text>学过的内容会自动收录在这里，方便随时接着学习</text></view><button class="empty-action" @tap="go(recentCategory==='reading'?'reading':recentCategory==='grammar'?'grammar':recentCategory==='word'?'vocab':'puzzle')">去{{ recentCategoryLabel }}看看 <text>›</text></button><view class="empty-category-hint"><text>也可以切换上方分类，查看其他学习记录</text></view></view></view>
    </scroll-view>
    <view v-if="view === 'worddetail' && !wordReadOnly" class="fixed-word-action"><button class="primary-button" @tap="beginSpelling('worddetail')">下一步 · 拼写练习</button></view>
    <view v-if="!immersive && ['home','reading','vocab','grammar','puzzle'].includes(view)" class="tabbar"><view v-for="tab in tabs" :key="tab.id" class="tab-item" :class="{active: activeTab === tab.id}" @tap="go(tab.id)"><text class="tab-icon">{{ tab.icon }}</text><text>{{ tab.label }}</text></view></view>
  </view>
  <view v-if="toastMessage" class="toast">{{ toastMessage }}</view>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { articles, externalSeries as externalSeriesData, words, grammar, articleGrammar, puzzleSets as puzzleSetsData, getWordContentSource, getGrammarContentSource } from '../pages/index/learning-data.js'
import { rewardedAdUnitId } from '../config/rewarded-ad.js'
import { dailyWordIndexes, localDayKey } from '../config/daily-words.js'

const props = defineProps({ initialView: { type: String, default: 'home' }, initialIndex: { type: Number, default: 0 }, initialPuzzleIndex: { type: Number, default: 0 }, initialChapter: { type: Number, default: 0 }, initialSource: { type: String, default: 'article' }, initialSeriesIndex: { type: Number, default: -1 }, initialNote: { type: Number, default: 0 }, sourceArticleIndex: { type: Number, default: -1 }, returnView: { type: String, default: 'vocab' }, wordReadOnly: { type: Boolean, default: false }, initialDailyStudy: { type: Boolean, default: false }, initialStudyDate: { type: String, default: '' } })
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
const articleGrammarNoteIndex = ref(props.initialNote)
const sourceArticleIndex = ref(props.sourceArticleIndex)
const questionIndex = ref(0)
const selectedOption = ref(-1)
const answered = ref(false)
const isCorrect = ref(false)
const fillAnswer = ref('')
const spellIndex = ref(0)
const spellReturn = ref(props.returnView)
const spellWords = ref(props.initialView === 'spell' ? props.returnView === 'worddetail' ? [words[props.initialIndex] || words[0]] : props.returnView === 'articlewordlist' ? (props.initialSource === 'external' ? ((externalSeriesData[props.initialIndex] || externalSeriesData[0]).chapters[props.initialChapter]?.words || []) : ((articles[props.sourceArticleIndex] || articles[0]).words || [])).map(id => words.find(word => word.word === id)).filter(Boolean) : words : words)
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
const currentArticle = computed(() => isExternalReading.value ? (() => { const chapter = currentExternalChapter.value; const series = currentExternalSeries.value; return {id:'external-' + series.id + '-' + externalChapterIndex.value,title:chapter.title,translation:series.translation,level:series.level,minutes:chapter.minutes,icon:series.icon,theme:series.theme,paragraphs:chapter.paragraphs,translations:chapter.translations,words:chapter.words || [],questions:chapter.questions || [],chapterCount:series.chapters.length} })() : (articles[articleIndex.value] || articles[0]))
const readingCompletionKey = computed(() => isExternalReading.value ? 'external:' + currentExternalSeries.value.id + ':' + externalChapterIndex.value : 'article:' + currentArticle.value.id)
const readingCompleted = computed(() => Boolean(readingCompletion.value[readingCompletionKey.value]))
const visibleWordList = computed(() => isScopedArticle.value ? (currentArticle.value.words || []).map(id => allWords.find(word => word.word === id)).filter(Boolean) : favoriteWords.value)
const scopedWordIndexes = computed(() => isScopedArticle.value ? visibleWordList.value.map(word => allWords.indexOf(word)) : [])
const scopedWordPosition = computed(() => scopedWordIndexes.value.indexOf(wordIndex.value))
const articleWordEntries = computed(() => (currentArticle.value.words || []).map(id => allWords.find(word => word.word === id)).filter(Boolean))
const currentArticleGrammar = computed(() => isExternalReading.value ? (currentExternalChapter.value.grammarNotes || []) : (articleGrammar[currentArticle.value.id] || []))
const currentArticleGrammarNote = computed(() => currentArticleGrammar.value[articleGrammarNoteIndex.value] || currentArticleGrammar.value[0] || {})
const articleGrammarContent = computed(() => getGrammarContentSource(currentArticleGrammarNote.value))
const currentWord = computed(() => allWords[wordIndex.value] || allWords[0])
const isCurrentWordLearned = computed(() => Boolean(wordCompletion.value[currentWord.value.word]))
const isCurrentTodayWordDone = computed(() => Boolean((studyDate.value === todayKey.value ? dailyWordProgress.value : loadDailyWordProgress(studyDate.value))[currentWord.value.word]))
const spellActionLabel = computed(() => !answered.value ? '检查拼写' : spellReturn.value === 'worddetail' ? nextStudyWordIndex.value >= 0 ? '下一个单词' : dailyStudy.value ? '完成今日学习' : isScopedArticle.value ? isExternalReading.value ? '完成本章词汇' : '完成本文词汇' : '完成本轮学习' : spellIndex.value < spellWords.value.length - 1 ? '下一个单词' : '完成练习')
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
const pageTitle = computed(() => ({home:'读句 English',reading:'精读',article:'文章精读',questions:'阅读理解',externalchapters:'小说目录',externalchapter:'章节阅读',vocab:'单词详解',wordlist:isScopedArticle.value ? '本文重点词汇' : '我的收藏',worddetail:'单词详解',spell:'拼写练习',grammar:'语法学习',gramlist:'语法拆解',gramdetail:'语法详解',gramquiz:'语法练习',articlegramlist:'本文语法解析',articlegramdetail:'文章语法解析',puzzle:'拼句练习',puzzleplay:'拼句练习',recent:'最近学习'})[view.value] || '读句 English')
const immersive = computed(() => ['spell','questions','gramquiz'].includes(view.value))
const practiceIndex = computed(() => view.value === 'spell' ? spellIndex.value : view.value === 'gramquiz' ? 0 : questionIndex.value)
const practiceTotal = computed(() => view.value === 'spell' ? spellWords.value.length : view.value === 'gramquiz' ? 1 : currentArticle.value.questions.length)
const puzzleSets = puzzleSetsData
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
const recentEmptyDescription = computed(() => ({reading:'完成一篇文章后，会出现在这里。',grammar:'学习过的语法知识点会单独保存在这里。',word:'读完详解并完成拼写后，单词会保存在这里。',puzzle:'开始任意一组拼句练习，进度会保存在这里。'})[recentCategory.value])
const articlePuzzleSets = computed(() => puzzleSets.map((set,setIndex) => ({...set,setIndex})).filter(set => Boolean(set.sourceArticleId)))
const independentPuzzleSets = computed(() => puzzleSets.map((set,setIndex) => ({...set,setIndex})).filter(set => !set.sourceArticleId))
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
function loadRecentItems() { try { return uni.getStorageSync('readEnglishRecent') || [] } catch (_) { return [] } }
function loadReadingCompletion() { try { const completed = {...(uni.getStorageSync('readEnglishReadingCompletion') || {})}; let migrated = false; for (const item of loadRecentItems()) { let key = ''; if (item.type === 'article' && articles[item.index]) key = 'article:' + articles[item.index].id; if (item.type === 'externalArticle' && externalSeriesData[item.seriesIndex]?.chapters[item.chapterIndex]) key = 'external:' + externalSeriesData[item.seriesIndex].id + ':' + item.chapterIndex; if (key && !completed[key]) { completed[key] = true; migrated = true } } if (migrated) uni.setStorageSync('readEnglishReadingCompletion', completed); return completed } catch (_) { return {} } }
function loadWordCompletion() { try { return uni.getStorageSync('readEnglishWordCompletion') || {} } catch (_) { return {} } }
function loadFavoriteWords() { try { const saved = uni.getStorageSync('readEnglishWordFavorites'); return Array.isArray(saved) ? saved : [] } catch (_) { return [] } }
function loadDailyWordProgress(dayKey) { try { return uni.getStorageSync('readEnglishDailyWordProgress:' + dayKey) || {} } catch (_) { return {} } }
function loadPuzzleProgress() { try { return uni.getStorageSync('readEnglishPuzzleProgress') || {} } catch (_) { return {} } }
function syncRecentItems() { recentItems.value = loadRecentItems() }
function syncReadingCompletion() { readingCompletion.value = loadReadingCompletion() }
function syncWordCompletion() { wordCompletion.value = loadWordCompletion() }
function syncFavoriteWords() { favoriteWordIds.value = loadFavoriteWords() }
function syncDailyWordProgress() { dailyWordProgress.value = loadDailyWordProgress(todayKey.value) }
function refreshToday() { const nextDay = localDayKey(); if (nextDay !== todayKey.value) { todayKey.value = nextDay; syncDailyWordProgress() } }
function syncPuzzleProgress() { puzzleProgress.value = loadPuzzleProgress() }
function trackRecent(type, index, title, subtitle, extra = {}) {
  const key = extra.seriesIndex !== undefined ? type + ':' + extra.seriesIndex + ':' + extra.chapterIndex : type + ':' + index
  const item = {key, type, index, title, subtitle, time:Date.now(), ...extra}
  const ordered = [item, ...recentItems.value.filter(entry => entry.key !== item.key)]
  const next = ordered
  recentItems.value = next
  try { uni.setStorageSync('readEnglishRecent', next); uni.$emit('readEnglishRecentUpdate') } catch (_) {}
}
function recentIcon(type) { return ({article:'▤',externalArticle:'▤',word:'Aa',grammar:'文',puzzle:'拼'})[type] || '•' }
function recentTone(type) { return ({article:'blue',word:'mint',grammar:'lilac',puzzle:'gold'})[type] || 'blue' }
function recentSubtitle(item) { if (item.type === 'word') return (wordCompletion.value[allWords[item.index]?.word] ? '已学完 · ' : '最近浏览 · ') + item.subtitle; if (item.type !== 'puzzle') return item.subtitle; const total = item.puzzleTotal || (puzzleSets[item.index]?.items.length || 0); if (item.puzzleCompleted) return '已完成 · ' + total + ' 句'; return '已完成 ' + (item.puzzleCursor || 0) + ' / ' + total + ' 句' }
function puzzleProgressPercent(item) { const total = item.puzzleTotal || (puzzleSets[item.index]?.items.length || 1); return Math.max(0, Math.min(100, item.puzzleCompleted ? 100 : (item.puzzleCursor || 0) / total * 100)) }
function puzzleProgressFor(set) { const saved = puzzleProgress.value[set.id] || {}; return {cursor:Math.min(saved.cursor || 0,set.items.length),completed:Boolean(saved.completed)} }
function puzzleSourceLabel(set) { const source = articles.find(article => article.id === set.sourceArticleId); return source ? '来自《' + source.translation + '》' : '独立练习' }
function openRecent(item) { if (item.type === 'article') openArticle(item.index); else if (item.type === 'externalArticle') openExternalChapter(item.chapterIndex,item.seriesIndex); else if (item.type === 'word') openWord(item.index, true); else if (item.type === 'grammar') openGrammar(item.index); else if (item.type === 'puzzle') startPuzzle(item.index) }
function clearRecent() { recentItems.value = []; try { uni.removeStorageSync('readEnglishRecent'); uni.$emit('readEnglishRecentUpdate') } catch (_) {} }
function selectRecentCategory(category) { recentCategory.value = category; recentPageSize.value = 10; scrollTop.value = 0 }
function loadMoreRecent() { if (view.value === 'recent' && recentPageSize.value < visibleRecentItems.value.length) recentPageSize.value += 10 }
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
  const routes = {home:'/pages/index/index',reading:'/pages/reading/index',article:'/pages/reading/article',questions:'/pages/reading/questions',vocab:'/pages/vocab/index',wordlist:'/pages/vocab/list',worddetail:'/pages/vocab/detail',spell:'/pages/vocab/spell',grammar:'/pages/grammar/index',gramlist:'/pages/grammar/index',gramdetail:'/pages/grammar/detail',gramquiz:'/pages/grammar/quiz',articlegramlist:'/pages/reading/grammar',articlegramdetail:'/pages/reading/grammar-detail',puzzle:'/pages/puzzle/index',puzzleplay:'/pages/puzzle/play',recent:'/pages/recent/index'}
  if (routes[next] && next !== props.initialView) {
    const item = ['article','questions','articlegramlist','articlegramdetail'].includes(next) ? articleIndex.value : next === 'worddetail' ? wordIndex.value : next === 'spell' ? spellReturn.value === 'articlewordlist' ? articleIndex.value : wordIndex.value : ['gramdetail','gramquiz'].includes(next) ? grammarIndex.value : next === 'puzzleplay' ? puzzleSetIndex.value : 0
    const externalContext = isExternalReading.value ? '&source=external&series=' + externalSeriesIndex.value + '&chapter=' + externalChapterIndex.value : ''
    let extra = ''
    if (next === 'spell') extra = '&from=' + spellReturn.value + (spellReturn.value === 'worddetail' ? wordStudyQuery() : (spellReturn.value === 'articlewordlist' ? '&article=' + articleIndex.value : '') + (isExternalReading.value ? externalContext : ''))
    if (next === 'worddetail') extra = (wordReadOnly.value ? '&readonly=1' : '') + wordStudyQuery()
    if (next === 'articlegramdetail') extra += '&note=' + articleGrammarNoteIndex.value
    if (next === 'puzzleplay') extra = '&sentence=' + puzzleIndex.value
    const source = isExternalReading.value && ['questions','articlegramlist','articlegramdetail'].includes(next) ? externalContext : ''
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
function openArticleGrammar(i) { articleGrammarNoteIndex.value = i; go('articlegramdetail') }
function isFavorite(word) { return favoriteWordIds.value.includes(word) }
function toggleFavorite(word) { favoriteWordIds.value = isFavorite(word) ? favoriteWordIds.value.filter(id => id !== word) : [...favoriteWordIds.value, word]; try { uni.setStorageSync('readEnglishWordFavorites', favoriteWordIds.value); uni.$emit('readEnglishWordFavoritesUpdate') } catch (_) {} }
function isTodayWordDone(index) { return Boolean(dailyWordProgress.value[allWords[index].word]) }
function openFavoriteWords() { uni.navigateTo({url:'/pages/vocab/list'}) }
function openTodayWord() { const index = todayWordIndexes.value.find(index => !isTodayWordDone(index)) ?? todayWordIndexes.value[0]; if (index === undefined) return; studyDate.value = todayKey.value; openWord(index, false, true) }
function openWord(i, readOnly = false, fromDaily = false) { wordIndex.value = i; wordReadOnly.value = readOnly; dailyStudy.value = fromDaily; scrollTop.value = 1; nextTick(() => { scrollTop.value = 0 }); go('worddetail') }
function completeWordAfterSpelling(word) { if (spellReturn.value !== 'worddetail') return; if (!wordCompletion.value[word.word]) { wordCompletion.value = {...wordCompletion.value,[word.word]:true}; try { uni.setStorageSync('readEnglishWordCompletion',wordCompletion.value); uni.$emit('readEnglishWordCompletionUpdate') } catch (_) {} } if (dailyStudy.value && studyWordIndexes.value.includes(wordIndex.value)) { const updated = {...loadDailyWordProgress(studyDate.value), [word.word]:true}; try { uni.setStorageSync('readEnglishDailyWordProgress:' + studyDate.value, updated); uni.$emit('readEnglishDailyWordProgressUpdate') } catch (_) {}; if (studyDate.value === todayKey.value) dailyWordProgress.value = updated } trackRecent('word',wordIndex.value,word.word,word.pos + ' ' + word.meaning) }
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
  const fallbackUrl = spellReturn.value === 'articlewordlist' && isExternalReading.value ? '/pages/vocab/list?source=external&series=' + externalSeriesIndex.value + '&chapter=' + externalChapterIndex.value : spellReturn.value === 'articlewordlist' ? '/pages/vocab/list?article=' + sourceArticleIndex.value : '/pages/vocab/list'
  uni.navigateBack({fail:() => uni.redirectTo({url:fallbackUrl})})
}
function chooseGrammar(i) { if (grammarAnswered.value) return; selectedOption.value = i }
function startGrammarQuiz() { selectedOption.value = -1; grammarAnswered.value = false; go('gramquiz') }
function grammarQuizAction() { if (!grammarAnswered.value) { if (selectedOption.value < 0) { toast('先选择一个答案'); return }; grammarCorrect.value = selectedOption.value === currentGrammar.value.quiz.answer; grammarAnswered.value = true } else { back() } }
function pickPuzzle(i) { if (usedPuzzle.value.includes(i) || puzzleAnswered.value) return; puzzleWords.value.push(shuffledPuzzle.value[i]); usedPuzzle.value.push(i); puzzleChecked.value = false }
function unpickPuzzle(i) { if (puzzleAnswered.value) return; const word = puzzleWords.value[i]; puzzleWords.value.splice(i,1); const bankIndex = usedPuzzle.value.find(j => shuffledPuzzle.value[j] === word); if (bankIndex !== undefined) usedPuzzle.value = usedPuzzle.value.filter(j => j !== bankIndex); puzzleChecked.value = false }
function savePuzzleProgress(setIndex, cursor, completed = false) { const set = puzzleSets[setIndex]; if (!set) return; const nextProgress = {...puzzleProgress.value,[set.id]:{cursor,completed,total:set.items.length}}; puzzleProgress.value = nextProgress; try { uni.setStorageSync('readEnglishPuzzleProgress',nextProgress); uni.$emit('readEnglishPuzzleProgressUpdate') } catch (_) {}; trackRecent('puzzle',setIndex,set.title,set.subtitle + ' · 拼句练习',{puzzleCursor:cursor,puzzleTotal:set.items.length,puzzleCompleted:completed}) }
function startPuzzle(i, fromStart = false) { puzzleSetIndex.value = ((i % puzzleSets.length) + puzzleSets.length) % puzzleSets.length; const set = puzzleSets[puzzleSetIndex.value]; try { puzzleProgress.value = uni.getStorageSync('readEnglishPuzzleProgress') || {} } catch (_) {}; const saved = puzzleProgress.value[set.id] || {cursor:0,completed:false}; const cursor = fromStart || saved.completed ? 0 : Math.min(saved.cursor || 0,set.items.length - 1); puzzleIndex.value = cursor; savePuzzleProgress(puzzleSetIndex.value,cursor,false); initPuzzle(); go('puzzleplay') }
function puzzleAction() { if (puzzleAnswered.value) { if (puzzleIndex.value < currentPuzzleSet.value.items.length - 1) { puzzleIndex.value++; initPuzzle() } else { toast('这组练习完成'); back() }; return }; if (puzzleWords.value.length !== shuffledPuzzle.value.length) { toast('先把所有单词拼完'); return }; puzzleCorrect.value = puzzleWords.value.join(' ') === puzzle.value.answer; puzzleChecked.value = true; if (!puzzleCorrect.value) return; puzzleAnswered.value = true; const nextCursor = puzzleIndex.value + 1; savePuzzleProgress(puzzleSetIndex.value,nextCursor,nextCursor === currentPuzzleSet.value.items.length) }
function initPuzzle() { shuffledPuzzle.value = puzzle.value.answer.split(' ').sort(() => Math.random() - .5); puzzleWords.value = []; usedPuzzle.value = []; puzzleAnswered.value = false; puzzleChecked.value = false; puzzleCorrect.value = false }
if (props.initialView === 'spell') setupSpell()
else initPuzzle()
let dayRefreshTimer
onMounted(() => { hintPageActive = true; uni.$on('readEnglishRecentUpdate', syncRecentItems); uni.$on('readEnglishReadingCompletionUpdate', syncReadingCompletion); uni.$on('readEnglishWordCompletionUpdate', syncWordCompletion); uni.$on('readEnglishWordFavoritesUpdate', syncFavoriteWords); uni.$on('readEnglishDailyWordProgressUpdate', syncDailyWordProgress); uni.$on('readEnglishPuzzleProgressUpdate', syncPuzzleProgress); uni.$on('readEnglishAdvanceWord', syncNextWord); dayRefreshTimer = setInterval(refreshToday, 60000) })
onUnmounted(() => { hintPageActive = false; pendingHint = null; clearInterval(dayRefreshTimer); uni.$off('readEnglishRecentUpdate', syncRecentItems); uni.$off('readEnglishReadingCompletionUpdate', syncReadingCompletion); uni.$off('readEnglishWordCompletionUpdate', syncWordCompletion); uni.$off('readEnglishWordFavoritesUpdate', syncFavoriteWords); uni.$off('readEnglishDailyWordProgressUpdate', syncDailyWordProgress); uni.$off('readEnglishPuzzleProgressUpdate', syncPuzzleProgress); uni.$off('readEnglishAdvanceWord', syncNextWord) })
</script>

<style>
.fixed-word-action{flex:none;padding:22rpx 30rpx calc(22rpx + env(safe-area-inset-bottom));background:#f7f9fcf5;border-top:1rpx solid #e9edf3}
page{height:100%;background:#f4f7fc;color:#303d53;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}view,text,button{box-sizing:border-box}.app-shell{height:100vh;display:flex;flex-direction:column;background:#f4f7fc}.status-spacer{height:env(safe-area-inset-top);min-height:env(safe-area-inset-top);background:#f8faff}.topbar{height:92rpx;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 28rpx;background:#f8faff;border-bottom:1rpx solid #e9edf3}.top-title{font-size:34rpx;font-weight:700;color:#263a5d}.top-action{min-width:72rpx;text-align:right;color:#3978ef;font-size:25rpx}.back-hit{width:70rpx;height:76rpx;display:flex;align-items:center}.back-arrow{font-size:64rpx;color:#61748f;line-height:1}.practice-head{height:92rpx;flex:none;padding:0 30rpx;display:flex;align-items:center;justify-content:space-between;background:#eaf2fc}.practice-heading{font-size:31rpx;font-weight:700;color:#263a5d}.step-count{font-size:25rpx;color:#8291a5}.page-scroll{flex:1;min-height:0;height:0}.page{padding:24rpx 30rpx 40rpx}.home-page{padding-top:18rpx}.hero{height:290rpx;border-radius:34rpx;padding:34rpx 28rpx;position:relative;overflow:hidden;background:linear-gradient(125deg,#d6e9ff,#edf5ff 65%,#e4f5ed)}.hero-copy{position:relative;z-index:2;display:flex;flex-direction:column}.eyebrow{font-size:20rpx;letter-spacing:2rpx;color:#6e87a7;font-weight:700}.hero-title{margin-top:22rpx;font-size:39rpx;line-height:1.3;font-weight:750;color:#2c456b}.hero-sub{margin-top:12rpx;font-size:23rpx;color:#7188a5}.book-art{position:absolute;z-index:2;right:48rpx;top:48rpx;width:130rpx;height:166rpx;border-radius:16rpx 24rpx 24rpx 16rpx;background:#fff;box-shadow:9rpx 10rpx 0 #a9c8eb,0 14rpx 30rpx #4f668129;transform:rotate(7deg);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#4b83d3;font-size:60rpx;font-weight:700}.book-mark{font-size:17rpx;letter-spacing:3rpx}.hero-orb{position:absolute;width:270rpx;height:270rpx;border-radius:50%;right:-56rpx;top:26rpx;background:#ffffff65}.section-head{display:flex;align-items:center;justify-content:space-between;margin:34rpx 4rpx 18rpx}.section-title{font-size:30rpx;font-weight:700;color:#354968}.section-note,.inline-link{font-size:21rpx;color:#8995a6}.inline-link{color:#3978ef}.module-grid{display:grid;grid-template-columns:1fr 1fr;gap:18rpx}.module-card{height:180rpx;border-radius:30rpx;padding:20rpx;position:relative;display:flex;flex-direction:column}.module-blue{background:#e1edff}.module-gold{background:#fff0d7}.module-green{background:#e5f5ed}.module-purple{background:#eeeaff}.module-icon{font-size:38rpx;color:#536f98;font-weight:700}.module-name{font-size:28rpx;font-weight:700;color:#344763;margin-top:7rpx}.module-desc{font-size:19rpx;color:#77879c;margin-top:5rpx}.module-arrow{position:absolute;right:20rpx;bottom:18rpx;color:#9aa8ba;font-size:34rpx}.card{background:#fff;border-radius:28rpx;margin-bottom:16rpx;padding:24rpx;box-shadow:0 6rpx 20rpx #263a5d08}.recent-card,.recent-line,.word-row,.learning-link,.article-card{display:flex;align-items:center;gap:20rpx}.art-thumb{width:100rpx;height:100rpx;border-radius:24rpx;display:flex;align-items:center;justify-content:center;font-size:48rpx}.art-blue{background:#e2edff;color:#5484c6}.recent-copy{display:flex;flex-direction:column;gap:8rpx;flex:1;min-width:0}.card-title{font-size:27rpx;font-weight:700;color:#3a4e6e}.card-sub{font-size:21rpx;color:#8995a6}.tag-row{display:flex;gap:10rpx;margin-top:8rpx}.tag{display:inline-flex;padding:5rpx 12rpx;border-radius:12rpx;background:#f0f3f8;color:#76869c;font-size:18rpx}.chevron{color:#aab5c4;font-size:38rpx}.mini-icon{width:76rpx;height:76rpx;flex:none;border-radius:22rpx;display:flex;align-items:center;justify-content:center;font-size:30rpx;font-weight:700}.mint{background:#e3f4ed;color:#58aa89}.gold{background:#fff1d7;color:#b6873e}.lilac{background:#eeeaff;color:#8072cb}.blue{background:#e1edff;color:#3978ef}.intro-block{display:flex;flex-direction:column;gap:12rpx;margin:20rpx 4rpx 28rpx}.large-title{font-size:42rpx;line-height:1.3;font-weight:750;color:#263a5d}.muted{font-size:23rpx;color:#8995a6;line-height:1.6}.filter-row{display:flex;gap:14rpx;margin-bottom:20rpx}.filter-chip{font-size:22rpx;padding:12rpx 26rpx;border-radius:32rpx;background:#fff;color:#8290a4}.filter-chip.selected{background:#3978ef;color:white}.article-card{padding:20rpx;transition:transform .15s}.article-art{width:142rpx;height:142rpx;border-radius:24rpx;display:flex;align-items:center;justify-content:center;font-size:58rpx;flex:none}.theme-blue{background:#e2edff}.theme-gold{background:#fff0d6}.theme-green{background:#def2e9}.theme-purple{background:#eeeaff}.article-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:7rpx}.article-title{font-size:27rpx;font-weight:700;color:#334866}.article-translation{font-size:21rpx;color:#8794a6}.article-heading{display:flex;flex-direction:column;gap:12rpx;padding:12rpx 4rpx 20rpx}.story-banner{height:230rpx;border-radius:28rpx;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-bottom:24rpx;color:#4e78b5}.story-emoji{font-size:70rpx}.story-banner-title{font-size:29rpx;font-weight:700;margin-top:6rpx}.story-banner-caption{font-size:19rpx;opacity:.75;margin-top:6rpx}.reading-text{padding:4rpx 6rpx}.paragraph{font-size:31rpx;line-height:1.85;color:#3d4c63;margin-bottom:30rpx}.sentence{display:inline}.translation-line{display:block;font-size:23rpx;line-height:1.7;color:#8795a8;margin-top:10rpx;padding:12rpx 17rpx;background:#edf2f8;border-radius:12rpx}.learning-links{background:#fff;border-radius:26rpx;padding:0 22rpx;box-shadow:0 5rpx 18rpx #263a5d08}.learning-link{min-height:112rpx;border-bottom:1rpx solid #edf0f4}.learning-link:last-child{border:0}.learning-link>view:nth-child(2){display:flex;flex-direction:column;gap:7rpx;flex:1}.bottom-spacer{height:35rpx}.progress-row{display:flex;align-items:center;gap:18rpx;margin:10rpx 0 38rpx}.progress-row .muted{font-size:21rpx;white-space:nowrap}.progress-track{height:12rpx;border-radius:12rpx;background:#e7edf3;overflow:hidden;flex:1}.progress-fill{height:100%;border-radius:12rpx;background:#70caa8;transition:width .25s}.question-type{font-size:21rpx;color:#5288c9;font-weight:700;background:#e8f1ff;border-radius:10rpx;padding:8rpx 14rpx;align-self:flex-start}.question-title{display:block;font-size:35rpx;line-height:1.55;color:#303d53;font-weight:700;margin-top:25rpx}.question-cn{display:block;font-size:24rpx;color:#8b97a8;margin-top:10rpx;line-height:1.6}.option-list{display:flex;flex-direction:column;gap:16rpx;margin-top:35rpx}.option-card{min-height:92rpx;padding:21rpx 23rpx;border:2rpx solid #e9edf3;border-radius:22rpx;background:#fff;display:flex;align-items:center;gap:18rpx;font-size:25rpx;line-height:1.5;color:#40516a}.option-letter{width:42rpx;height:42rpx;border-radius:50%;background:#f0f3f8;color:#71829a;display:flex;align-items:center;justify-content:center;font-size:21rpx;font-weight:700;flex:none}.chosen-option{border-color:#75a1ef;background:#f1f6ff}.correct-option{border-color:#70caa8;background:#eaf7f1}.wrong-option{border-color:#e98276;background:#fff2f0}.option-check{margin-left:auto;color:#45a580;font-size:32rpx}.explanation{margin-top:22rpx;padding:22rpx;border-radius:20rpx;background:#eaf7f1;display:flex;flex-direction:column;gap:8rpx}.explanation-title{font-size:25rpx;font-weight:700;color:#419575}.explanation-text{font-size:22rpx;line-height:1.7;color:#557267}.bottom-action{position:sticky;bottom:0;margin:36rpx -30rpx -40rpx;padding:22rpx 30rpx calc(22rpx + env(safe-area-inset-bottom));background:#f7f9fcf5}.primary-button{width:100%;height:92rpx;border:0;border-radius:24rpx;background:#3978ef;color:#fff;font-size:29rpx;font-weight:700;line-height:92rpx;box-shadow:0 8rpx 20rpx #3978ef30}.primary-button:active{transform:scale(.985);background:#2e69d7}.primary-button[disabled]{background:#c6ced8;color:#fff}.fill-wrap{margin-top:34rpx}.fill-input{height:94rpx;padding:0 22rpx;border:2rpx solid #e4eaf1;border-radius:20rpx;background:#fff;font-size:28rpx}.vocab-intro,.grammar-hero{display:flex;flex-direction:column;gap:11rpx;padding:28rpx;border-radius:28rpx;background:linear-gradient(125deg,#d6e9ff,#edf5ff 65%,#e7f6ef);margin-bottom:22rpx}.book-card{padding:24rpx}.book-row{display:flex;gap:20rpx}.book-cover{width:112rpx;height:142rpx;border-radius:17rpx;background:linear-gradient(145deg,#4bb58c,#a0e3c6);display:flex;align-items:center;justify-content:center;color:white;font-size:42rpx;font-weight:700;box-shadow:inset -10rpx 0 #ffffff35}.book-info{flex:1;display:flex;flex-direction:column;gap:12rpx}.book-actions{display:flex;justify-content:space-between;border-top:1rpx solid #edf0f4;margin-top:22rpx;padding:19rpx 0;color:#3978ef;font-size:22rpx}.book-card .primary-button{height:82rpx;line-height:82rpx}.word-list{display:flex;flex-direction:column}.word-row{padding:22rpx;margin-bottom:13rpx;justify-content:space-between}.word-row>view{display:flex;flex-direction:column;gap:8rpx}.word-main{font-size:30rpx;font-weight:700;color:#34496a}.word-sub{font-size:22rpx;color:#8995a6}.word-hero{padding:28rpx;border-radius:28rpx;background:#e7f1ff;display:flex;flex-direction:column;gap:14rpx}.word-display{font-size:66rpx;font-weight:750;color:#263a5d}.pronounce-row{display:flex;align-items:center;gap:20rpx}.pronunciation{font-family:Georgia,serif;color:#70819a;font-size:26rpx}.sound-button{color:#3978ef;background:#fff;padding:11rpx 17rpx;border-radius:20rpx;font-size:20rpx}.word-badges{display:flex;gap:10rpx}.meaning{font-size:30rpx;font-weight:650;color:#3c506d;margin-top:5rpx}.detail-card{padding:24rpx}.detail-label{font-size:23rpx;font-weight:700;color:#3978ef;display:block;margin-bottom:10rpx}.detail-copy{font-size:24rpx;line-height:1.8;color:#506079;display:block}.form-line{border-top:1rpx solid #edf0f4;margin-top:20rpx;padding-top:18rpx}.example-card{display:flex;flex-direction:column;gap:10rpx}.example-en{font-size:26rpx;line-height:1.6;color:#3a4e6e}.example-cn{font-size:22rpx;line-height:1.6;color:#8995a6}.dual-action{display:flex;gap:16rpx}.dual-action .primary-button,.dual-action .secondary-button{flex:1}.secondary-button{height:92rpx;border:2rpx solid #3978ef;border-radius:24rpx;background:#fff;color:#3978ef;font-size:27rpx;font-weight:700;line-height:88rpx}.spell-page{min-height:100%;display:flex;flex-direction:column;background:linear-gradient(180deg,#e2f1ff 0,#f1f6fc 36%,#f4f7fc 100%)}.spell-prompt{text-align:center;padding:25rpx 5rpx;display:flex;flex-direction:column;gap:18rpx}.spell-meaning{font-size:31rpx;color:#40536f}.hint-link{font-size:21rpx;color:#568bc7}.spelling-card{margin-top:15rpx;padding:34rpx 22rpx;flex:1;display:flex;flex-direction:column;justify-content:center}.letter-slots,.letter-bank{display:flex;justify-content:center;gap:12rpx;flex-wrap:wrap}.letter-slots{min-height:72rpx;margin-bottom:55rpx}.letter-slot{min-width:42rpx;height:60rpx;border-bottom:3rpx solid #93a8c1;text-align:center;font-size:34rpx;font-weight:700;color:#314967}.letter-bank{gap:17rpx}.letter-key{min-width:78rpx;height:82rpx;padding:0 12rpx;border:2rpx solid #70caa8;border-radius:20rpx;background:#f2fbf7;color:#34556c;font-size:32rpx;font-weight:700;line-height:76rpx;box-shadow:0 7rpx 0 #70caa8}.letter-key[disabled]{opacity:.28}.grammar-card{display:flex;align-items:center;gap:19rpx}.grammar-icon{width:78rpx;height:78rpx;border-radius:22rpx;background:#eeeaff;color:#8072cb;display:flex;align-items:center;justify-content:center;font-size:32rpx}.grammar-copy{flex:1;display:flex;flex-direction:column;gap:8rpx}.grammar-pattern{background:#eaf2fc;padding:32rpx;text-align:center}.pattern-text{font-size:31rpx;font-weight:700;color:#3978ef;letter-spacing:1rpx}.grammar-hero{margin-bottom:20rpx}.question-page{padding-bottom:70rpx}.question-page .bottom-action{margin-top:auto}.puzzle-card{padding:26rpx}.puzzle-cn{display:block;font-size:29rpx;line-height:1.65;font-weight:650;color:#344763;margin:24rpx 0}.placed-words{min-height:100rpx;border:2rpx dashed #ccd8e7;border-radius:19rpx;padding:15rpx;display:flex;gap:10rpx;flex-wrap:wrap;align-items:center}.word-bank{display:flex;gap:10rpx;flex-wrap:wrap;margin:24rpx 0}.word-token{padding:13rpx 17rpx;border-radius:13rpx;background:#edf3fc;color:#405574;font-size:23rpx}.word-token.chosen{background:#e5f5ed;color:#397e63}.word-token.used{opacity:.25}.full-button{margin-top:12rpx}.empty-note{padding:24rpx}.tabbar{height:112rpx;flex:none;padding-bottom:env(safe-area-inset-bottom);background:#fff;border-top:1rpx solid #e9edf3;display:flex;align-items:center;justify-content:space-around}.tab-item{min-width:90rpx;display:flex;flex-direction:column;align-items:center;gap:5rpx;color:#8c98a9;font-size:19rpx}.tab-icon{font-size:34rpx;line-height:1.1;font-weight:650}.tab-item.active{color:#3978ef;font-weight:750}.toast{position:fixed;z-index:20;left:15%;right:15%;bottom:150rpx;border-radius:22rpx;padding:21rpx;background:#263a5de8;color:white;text-align:center;font-size:23rpx}
/* Sizes translated from complete-design.html's 390px reference frame. */
.topbar{height:108rpx;padding:0 26rpx}
.top-title{font-size:34rpx}
.hero{height:332rpx;margin:0 30rpx 28rpx;padding:34rpx;border-radius:42rpx}
.hero-title{font-size:44rpx}
.hero-sub{font-size:22rpx}
.book-art{right:56rpx;top:74rpx;width:152rpx;height:192rpx;border-radius:18rpx 28rpx 28rpx 18rpx}
.section-head{margin:32rpx 0 18rpx;padding:0 34rpx}
.section-title{font-size:30rpx}
.module-grid{padding:0 30rpx;gap:18rpx}
.module-card{height:182rpx;border-radius:34rpx;padding:24rpx}
.module-icon{font-size:40rpx}
.module-name{font-size:26rpx}
.module-desc{font-size:19rpx}
.recent-card,.recent-line{margin-left:30rpx;margin-right:30rpx;margin-bottom:18rpx;padding:26rpx;border-radius:34rpx}
.article-list{padding:0 28rpx}
.article-card{margin-bottom:18rpx;padding:22rpx;border-radius:36rpx}
.article-art{width:156rpx;height:150rpx;border-radius:26rpx}
.article-title{font-size:28rpx}
.filter-row{padding:26rpx 30rpx;margin:0}
.book-card{margin:28rpx 28rpx 20rpx;padding:26rpx;border-radius:36rpx}
.tabbar{height:134rpx}
.tab-item{font-size:18rpx}
.tab-icon{font-size:38rpx}
.reading-page,.grammar-page,.puzzle-page{padding-left:0;padding-right:0;padding-top:0}
.grammar-home-hero .hero-book,.puzzle-home-hero .hero-book{position:absolute;z-index:2;display:flex;align-items:center;justify-content:center;transform:rotate(7deg);border-radius:18rpx 28rpx 28rpx 18rpx;font-weight:700}
.grammar-home-hero .hero-book{right:30rpx;top:42rpx}.puzzle-home-hero .hero-book{right:30rpx;top:46rpx}
.puzzleplay-page .bottom-action{margin-top:36rpx}
/* Match the reference reading/grammar/puzzle landing layouts. */
.tabs{display:flex;height:98rpx;background:#f8faff;border-bottom:1rpx solid #e9edf3}
.design-tab{width:50%;display:flex;align-items:center;justify-content:center;color:#8b98aa;font-size:28rpx;font-weight:650;position:relative}
.design-tab.on{color:#3978ef}
.design-tab.on:after{content:'';position:absolute;bottom:0;width:68rpx;height:6rpx;border-radius:6rpx;background:#3978ef}
.filters{display:flex;gap:14rpx;padding:26rpx 30rpx}
.filter{font-size:20rpx;padding:14rpx 24rpx;background:#fff;border-radius:30rpx;color:#8190a4}
.filter.on{background:#3978ef;color:#fff}
.article-list{padding:0 28rpx}
.article{background:#fff;border-radius:36rpx;padding:22rpx;margin-bottom:18rpx;display:flex;align-items:center;gap:22rpx;box-shadow:0 6rpx 24rpx #263a5d08}
.art{width:156rpx;height:150rpx;border-radius:26rpx;display:flex;align-items:center;justify-content:center;flex:none;position:relative;overflow:hidden;font-size:54rpx}
.art:after{content:'';position:absolute;bottom:-30rpx;left:-10rpx;width:190rpx;height:64rpx;border-radius:50%;background:#ffffff78}
.art.theme-blue{background:#e2edff}.art.theme-gold{background:#fff0d6}.art.theme-green{background:#def2e9}.art.theme-purple{background:#eeeaff}
.article-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:8rpx}
.design-article-title{font-size:28rpx;font-weight:700;color:#334866}
.design-article-desc{font-size:20rpx;color:#8794a6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tags{display:flex;gap:10rpx;margin-top:8rpx}
.tag{padding:5rpx 12rpx;border-radius:16rpx;background:#f0f3f8;color:#76869c;font-size:18rpx}
.shelf{padding:32rpx;display:grid;grid-template-columns:1fr 1fr;gap:34rpx 26rpx}
.mag{display:flex;flex-direction:column;align-items:center;text-align:center}
.mag-cover{width:100%;height:256rpx;border-radius:28rpx;border:2rpx solid #dce5f3;background:#e6efff;display:flex;align-items:center;justify-content:center;font-size:70rpx;box-shadow:0 8rpx 0 #d6e2f2;position:relative;overflow:hidden}
.mag-cover:before{content:'';position:absolute;top:0;left:0;right:0;height:48rpx;background:#6795e3}
.mag-cover.gold{background:#fff1d6}.mag-cover.green{background:#e0f3e9}.mag-cover.purple{background:#ece9ff}
.mag-name{font-size:24rpx;color:#425574;font-weight:650;margin-top:18rpx}.mag-note{font-size:18rpx;color:#8c99aa;margin-top:6rpx}
.external-shelf{padding-top:28rpx;gap:30rpx 22rpx}.external-intro{grid-column:1/-1;padding:6rpx 2rpx 10rpx;display:flex;flex-direction:column;gap:8rpx}.external-heading{font-size:36rpx;font-weight:750;color:#334866;letter-spacing:1rpx}.external-book{display:flex;flex-direction:column;align-items:stretch;text-align:left;background:transparent;border-radius:0;padding:0 0 8rpx;box-shadow:none}.external-book .mag-cover{height:300rpx;border-radius:22rpx;border:2rpx solid #b7ccec;background:linear-gradient(150deg,#c4dcfa 0%,#eaf2ff 50%,#d9e8ff 100%);box-shadow:0 9rpx 0 #cbdcf0;display:block;text-align:left}.external-book .mag-cover:before{display:none}.external-book .mag-cover.theme-gold{background:linear-gradient(155deg,#f8dfaa 0%,#fff2d8 54%,#e8c47f 100%);border-color:#e0bd76}.cover-sun{position:absolute;width:138rpx;height:138rpx;border-radius:50%;background:#fff8d7;right:-14rpx;top:58rpx;box-shadow:0 0 0 12rpx #ffffff38}.theme-gold .cover-sun{background:#fff7dc}.cover-hill{position:absolute;width:145%;height:130rpx;left:-20%;border-radius:50% 50% 0 0}.hill-back{bottom:30rpx;background:#a9c9e9;transform:rotate(-8deg)}.hill-front{bottom:-34rpx;background:#83acd6;transform:rotate(7deg)}.theme-gold .hill-back{background:#dfc37f}.theme-gold .hill-front{background:#a9c17a}.cover-art{position:absolute;z-index:2;right:20rpx;bottom:54rpx;width:90rpx;height:90rpx;border-radius:50%;background:#ffffffd9;display:flex;align-items:center;justify-content:center;font-size:48rpx;box-shadow:0 8rpx 18rpx #4a679426}.cover-kicker{position:absolute;left:18rpx;top:19rpx;color:#5278a7;font-size:13rpx;font-weight:750;letter-spacing:2rpx}.cover-title{position:absolute;z-index:3;left:17rpx;right:17rpx;bottom:17rpx;color:#fff;font-family:Georgia,serif;font-weight:700;font-size:21rpx;line-height:1.2;text-shadow:0 2rpx 8rpx #2440609c}.cover-label{position:absolute;top:14rpx;right:12rpx;background:#ffffffdf;border-radius:18rpx;padding:7rpx 11rpx;font-size:14rpx;color:#60738e}.mag-name{font-size:23rpx;color:#334866;font-weight:750;margin-top:19rpx}.mag-note{font-size:17rpx;line-height:1.45;color:#8995a6;margin-top:7rpx;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.external-author{margin-top:10rpx;color:#6183ac;font-size:15rpx}
.external-directory{padding:28rpx 26rpx 52rpx}.series-overview{display:flex;gap:22rpx;align-items:stretch;padding:23rpx;background:#fff;border:2rpx solid #cfdae9;border-radius:30rpx;box-shadow:0 7rpx 0 #e2eaf4;position:relative}.series-overview:before{content:'✦  ✧';position:absolute;left:65rpx;top:-24rpx;padding:0 12rpx;background:#f4f7fc;color:#83a2cf;font-size:25rpx;letter-spacing:5rpx}.directory-cover{position:relative;overflow:hidden;width:190rpx;height:276rpx;flex:none;border-radius:16rpx;border:2rpx solid #78a0d2;background:linear-gradient(155deg,#72a9e8,#dbeaff 56%,#9fc3e8);box-shadow:5rpx 7rpx 0 #d6e2f1}.directory-cover.theme-gold{background:linear-gradient(155deg,#e8c46e,#fff2d8 58%,#9fb77c);border-color:#d6b152}.directory-sun{position:absolute;width:106rpx;height:106rpx;border-radius:50%;top:33rpx;right:11rpx;background:#fff3c9}.directory-wave{position:absolute;width:155%;height:105rpx;left:-23%;border-radius:50% 50% 0 0}.wave-one{bottom:45rpx;background:#7ca8d5;transform:rotate(-10deg)}.wave-two{bottom:-32rpx;background:#4c80b8;transform:rotate(9deg)}.theme-gold .wave-one{background:#a6bb7a}.theme-gold .wave-two{background:#78985f}.directory-cover-icon{position:absolute;z-index:2;top:78rpx;left:0;right:0;text-align:center;font-size:48rpx}.directory-cover-title{position:absolute;z-index:3;bottom:15rpx;left:12rpx;right:12rpx;color:white;text-align:center;font:700 16rpx Georgia,serif;text-shadow:0 2rpx 8rpx #223c6280}.series-copy{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;padding:8rpx 0}.series-copy .eyebrow{font-size:14rpx;letter-spacing:1rpx}.series-title{font-size:27rpx;line-height:1.3;font-weight:750;color:#334866;margin-top:12rpx}.series-original{font:italic 17rpx Georgia,serif;color:#7e8ea5;margin-top:7rpx}.series-description{font-size:19rpx;line-height:1.65;color:#77869b;margin-top:15rpx}.directory-heading{display:flex;align-items:center;justify-content:space-between;margin:36rpx 0 20rpx;padding:0 3rpx}.directory-heading-mark{position:relative;z-index:0;font-size:30rpx;font-weight:750;color:#334866;padding:3rpx 15rpx}.directory-heading-mark:before{content:'';position:absolute;z-index:-1;left:0;right:-4rpx;bottom:0;height:25rpx;border-radius:18rpx 13rpx 17rpx 12rpx;background:#dce9ff;transform:rotate(-2deg)}.directory-count{font-size:18rpx;color:#8995a6}.chapter-list{display:flex;flex-direction:column;gap:15rpx}.chapter-row{min-height:126rpx;display:flex;align-items:center;gap:18rpx;padding:22rpx 20rpx;background:#fff;border:2rpx solid #c6d5e8;border-radius:25rpx;box-shadow:0 5rpx 0 #e2eaf3;margin:0}.chapter-number{width:57rpx;flex:none;text-align:center;color:#426b9f;font-size:29rpx;font-weight:800;font-variant-numeric:tabular-nums}.chapter-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:9rpx}.chapter-title{font-size:22rpx;line-height:1.3;color:#334866;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chapter-meta{font-size:16rpx;line-height:1.45;color:#929eaf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chapter-arrow{width:49rpx;height:49rpx;border:2rpx solid #809ecc;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#edf4ff;color:#426b9f;font-size:33rpx;line-height:1}.external-source-note{text-align:center;padding:28rpx 0;color:#a0aaba;font-size:16rpx}.external-reading{padding:24rpx 31rpx 50rpx;background:#fff}.reading-series-label{display:flex;justify-content:space-between;align-items:center;color:#7890b1;font-size:17rpx;padding:2rpx 0 22rpx;border-bottom:1px solid #e9edf3}.external-chapter-title{display:block;font:700 36rpx/1.35 Georgia,'Times New Roman',serif;color:#263a5d;margin:28rpx 0 18rpx}.chapter-reading-meta{display:flex;gap:11rpx;padding-bottom:20rpx}.chapter-reading-meta text{font-size:16rpx;color:#8290a4;background:#f1f4f8;border-radius:18rpx;padding:7rpx 13rpx}.reading-tools{display:flex;justify-content:space-between;align-items:center;margin-top:5rpx}.reading-progress-label{font-size:17rpx;color:#8995a6}.translation-toggle{font-size:17rpx;color:#3978ef;padding:9rpx 13rpx;border-radius:18rpx;background:#edf4ff}.reading-progress-track{height:5rpx;background:#edf0f4;border-radius:8rpx;margin-top:10rpx;overflow:hidden}.reading-progress-fill{height:100%;background:#70caa8;border-radius:8rpx}.external-paragraphs{padding:27rpx 0 8rpx}.external-paragraph{display:flex;align-items:flex-start;gap:12rpx;margin-bottom:27rpx}.paragraph-number{padding-top:6rpx;color:#95a6bb;font-size:15rpx;font-weight:700;flex:none}.paragraph-content{flex:1;min-width:0}.external-sentence{display:inline;color:#334866;font-size:25rpx;line-height:1.95}.external-translation{display:block;margin-top:13rpx;padding:12rpx 0 0;border-top:1px dashed #dfe5ed;color:#8995a6;font-size:20rpx;line-height:1.8}.chapter-navigation{display:flex;gap:14rpx;padding:22rpx 0 0;border-top:1px solid #e9edf3}.chapter-navigation button{flex:1}.chapter-navigation .primary-button,.chapter-navigation .secondary-button{height:82rpx;line-height:78rpx;font-size:24rpx;border-radius:22rpx}.chapter-navigation button[disabled]{opacity:.42}
.grammar-home-hero,.puzzle-home-hero{position:relative;margin:26rpx 30rpx 28rpx;height:274rpx;padding:30rpx;border-radius:42rpx;overflow:hidden}
.grammar-home-hero{background:linear-gradient(135deg,#e7e2ff,#f3f0ff 65%,#eaf1ff)}
.grammar-home-hero .eyebrow{color:#7568bd}
.grammar-hero-title,.puzzle-hero-title{display:block;margin-top:14rpx;font-size:34rpx;line-height:1.3;font-weight:750;color:#504782}
.grammar-hero-sub,.puzzle-hero-sub{display:block;margin-top:10rpx;font-size:20rpx;color:#817aa8}
.grammar-book{right:30rpx;top:42rpx;width:120rpx;height:152rpx;background:#fff;color:#796ac9;box-shadow:8rpx 10rpx 0 #c5baf3;font-size:42rpx}
.grammar-filters{gap:10rpx}
.grammarlist{padding:0 28rpx}
.gramrow{min-height:120rpx;background:#fff;border-radius:30rpx;margin-bottom:16rpx;padding:20rpx;display:flex;align-items:center;gap:18rpx;box-shadow:0 6rpx 22rpx #263a5d08}
.gramicon{width:72rpx;height:72rpx;border-radius:22rpx;background:#eeeaff;color:#796ac9;display:flex;align-items:center;justify-content:center;font-size:30rpx;font-weight:700;flex:none}
.gramrow-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:9rpx}
.gramrow-title{font-size:24rpx;line-height:1.45;font-weight:700;color:#3b4d69}
.gramrow-sub{font-size:19rpx;color:#8995a6}
.puzzle-home-hero{height:286rpx;background:linear-gradient(135deg,#e6e1ff,#f4f1ff 65%,#e8f3ff)}
.puzzle-home-hero .eyebrow{color:#786abd}
.puzzle-hero-title{color:#4b457d}
.puzzle-hero-sub{color:#827ba9}
.puzzle-book{right:30rpx;top:46rpx;width:120rpx;height:152rpx;background:#fff;color:#786abd;box-shadow:8rpx 10rpx 0 #c8c0ed;font-size:42rpx}
.thumb{width:96rpx;height:94rpx;border-radius:26rpx;display:flex;align-items:center;justify-content:center;font-size:46rpx;flex:none}
.thumb.theme-blue{background:#e2edff}.thumb.theme-green{background:#e5f5ed}.thumb.puzzle-thumb{background:#fff0d7;color:#bc8a3e;font-size:31rpx}
.recent.puzzle-source .thumb{border-radius:26rpx}
.puzzle-source{display:flex;align-items:center;gap:20rpx;margin:0;padding:22rpx 20rpx;border-bottom:1rpx solid #eef1f5;border-radius:0}
.puzzle-source-card{margin:0 30rpx 18rpx;padding:0;overflow:hidden}.puzzle-set-status{font-size:18rpx;color:#66a88d}.puzzle-set-actions{display:flex;align-items:center;justify-content:flex-end;gap:14rpx;padding:10rpx 20rpx 17rpx}.puzzle-set-actions text{padding:10rpx 17rpx;border-radius:18rpx;font-size:18rpx}.puzzle-set-continue{background:#edf5ff;color:#3978ef;font-weight:700}.puzzle-set-restart{color:#8e99a8;background:#f5f6f8}
.puzzle-source-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:8rpx}
.arr{flex:none;margin-left:auto;color:#aab5c4;font-size:34rpx;line-height:1}
.puzzle-thumb{background:#fff0d7;color:#bc8a3e;font-size:31rpx}
.puzzleplay-page{padding-top:32rpx}
.recent-empty{margin:0 30rpx 18rpx;display:flex;flex-direction:column;gap:10rpx;padding:26rpx}
.clear-history{display:block;text-align:center;padding:24rpx;color:#8794a6;font-size:22rpx}
.empty-modules{display:flex;justify-content:space-between;margin-top:18rpx;color:#3978ef;font-size:23rpx}
.rich-content{display:block;margin:0 0 18rpx;padding:28rpx;border-radius:28rpx;background:#fff;color:#506079;font-size:24rpx;line-height:1.85;box-shadow:0 6rpx 20rpx #263a5d08}
.rich-content h3{margin:22rpx 0 10rpx;color:#354968;font-size:28rpx;line-height:1.45}
.rich-content p{margin:0 0 14rpx}
.source-card{display:flex;flex-direction:column;gap:12rpx}
.source-button{height:78rpx;margin:10rpx 0 0;border:0;border-radius:20rpx;background:#3978ef;color:#fff;font-size:25rpx;font-weight:700;line-height:78rpx}
.recent-category-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:10rpx;margin:0 0 24rpx}.recent-category{min-height:70rpx;padding:10rpx 7rpx;border:2rpx solid #e5eaf0;border-radius:20rpx;background:#fff;color:#75839a;display:flex;align-items:center;justify-content:center;gap:6rpx;font-size:20rpx;white-space:nowrap}.recent-category.active{border-color:#78a1dd;background:#eaf2ff;color:#3978ef;font-weight:700}.recent-count{min-width:28rpx;height:28rpx;padding:0 6rpx;border-radius:16rpx;background:#f0f3f7;color:#8a97a8;text-align:center;font-size:15rpx;line-height:28rpx}.recent-category.active .recent-count{background:#fff;color:#3978ef}.recent-entry{display:flex;align-items:center;gap:16rpx;padding:21rpx;margin-bottom:14rpx}.recent-entry .recent-copy{min-width:0}.recent-entry .card-title{font-size:24rpx;line-height:1.4}.recent-entry .card-sub{font-size:18rpx;line-height:1.5}.puzzle-progress-track{height:7rpx;margin-top:11rpx;border-radius:8rpx;background:#edf0f4;overflow:hidden}.puzzle-progress-fill{height:100%;border-radius:8rpx;background:#70caa8}.puzzle-recent-actions{display:flex;flex-direction:column;align-items:flex-end;gap:12rpx;flex:none}.puzzle-recent-actions text{font-size:17rpx;white-space:nowrap}.resume-puzzle{padding:8rpx 15rpx;border-radius:18rpx;background:#e5f4ec;color:#398466;font-weight:700}.restart-puzzle{color:#8995a6;padding:2rpx 8rpx}.recent-section .recent-empty{display:flex;flex-direction:column;gap:10rpx}.recent-empty .empty-modules text{color:#3978ef}
.recent-load-more{height:74rpx;display:flex;align-items:center;justify-content:center;color:#9aa6b5;font-size:19rpx}.recent-empty{min-height:690rpx;padding:46rpx 28rpx 38rpx;border:1rpx solid #edf1f7;border-radius:34rpx;background:linear-gradient(160deg,#fff 0%,#f8fbff 100%);display:flex;flex-direction:column;align-items:center;text-align:center;box-shadow:0 14rpx 38rpx #263a5d0a}.empty-illustration{width:220rpx;height:190rpx;position:relative;margin:8rpx auto 34rpx;display:flex;align-items:center;justify-content:center}.empty-orbit{position:absolute;width:176rpx;height:176rpx;border-radius:50%;background:linear-gradient(145deg,#e5efff,#edf8f3);box-shadow:inset 0 0 0 1rpx #fff;transform:rotate(-12deg)}.empty-book{z-index:1;width:112rpx;height:128rpx;border:3rpx solid #8aa9d2;border-radius:16rpx 22rpx 22rpx 16rpx;background:#fff;color:#5680b7;font-size:56rpx;font-weight:700;line-height:122rpx;box-shadow:9rpx 9rpx 0 #d6e4f5;transform:rotate(-7deg)}.empty-spark{position:absolute;z-index:2;color:#e0b461}.spark-one{top:4rpx;right:24rpx;font-size:40rpx}.spark-two{left:12rpx;bottom:30rpx;font-size:34rpx;color:#7cc5a5}.empty-title{font-size:31rpx;font-weight:750;color:#354a68}.empty-description{max-width:510rpx;margin-top:13rpx;color:#8b98aa;font-size:21rpx;line-height:1.7}.empty-tip{width:100%;margin-top:34rpx;padding:19rpx 17rpx;border-radius:18rpx;background:#f1f6fc;color:#7b8ba1;font-size:19rpx;line-height:1.55;display:flex;align-items:flex-start;gap:10rpx;text-align:left}.empty-tip-icon{color:#e0b461;font-size:23rpx;line-height:1.4}.empty-action{width:80%;height:82rpx;margin-top:28rpx;border:0;border-radius:24rpx;background:#3978ef;color:#fff;font-size:24rpx;font-weight:700;line-height:82rpx;box-shadow:0 8rpx 20rpx #3978ef28}.empty-action text{margin-left:10rpx;font-size:31rpx;vertical-align:-2rpx}.empty-category-hint{margin-top:26rpx;color:#a1adbb;font-size:18rpx}
.reading-completion{margin:35rpx 0 0;padding:25rpx 22rpx 20rpx;border-radius:26rpx;background:#fff;box-shadow:0 6rpx 22rpx #263a5d08;text-align:center}.reading-completion .primary-button{margin:0 auto;max-width:520rpx}.completion-note{display:block;margin-top:14rpx;font-size:18rpx;color:#9aa5b4}.primary-button.reading-done{background:#70b99b}.article-source-kicker{margin:2rpx 4rpx 13rpx;color:#7890b1;font-size:19rpx}
.external-theme{background:#fbf1df}.external-theme .status-spacer,.external-theme .topbar{background:#fbf1df}.external-theme .topbar{border-bottom-color:#eadcc6}.external-theme .top-title,.external-theme .back-arrow{color:#713b24}.external-theme .top-action{color:#996243}.external-theme .page-scroll{background:#fbf1df}.external-theme .tabbar{background:#fbf1df;border-top-color:#eadcc6}.external-theme .tab-item.active{color:#8a4a2d}.external-theme .tabs{background:#fbf1df;border-bottom-color:#eadcc6}.external-theme .design-tab{color:#a68e7e}.external-theme .design-tab.on{color:#713b24}.external-theme .design-tab.on:after{background:#b8c86d}.external-theme .eyebrow{color:#a27a5e}.external-theme .muted{color:#9a8172}.external-theme .external-heading,.external-theme .mag-name,.external-theme .series-title,.external-theme .chapter-title,.external-theme .external-chapter-title{color:#713b24}.external-theme .external-author,.external-theme .reading-series-label,.external-theme .chapter-reading-meta text{color:#9b7561}.external-theme .external-book .mag-cover{border-color:#d3b16c;box-shadow:0 9rpx 0 #ead8b7}.external-theme .external-book .mag-cover.theme-blue{background:linear-gradient(155deg,#d9eaff,#f6edda 59%,#abc8df)}.external-theme .external-book .mag-cover.theme-gold{background:linear-gradient(155deg,#f7dfa9,#fff3d9 54%,#e6c576)}.external-theme .cover-kicker{color:#8a5b3d}.external-theme .cover-label{color:#74442d;background:#fff8e8e8}.external-theme .cover-sun{background:#fff2b6}.external-theme .cover-hill.hill-back{background:#a6c7d7}.external-theme .cover-hill.hill-front{background:#789d9b}.external-theme .theme-gold .cover-hill.hill-back{background:#d9bd76}.external-theme .theme-gold .cover-hill.hill-front{background:#92a978}.external-theme .cover-art,.external-theme .directory-cover-icon{color:#713b24}.external-theme .mag-note,.external-theme .series-description,.external-theme .chapter-meta{color:#9a8172}.external-theme .external-book-hero{background:linear-gradient(135deg,#fffdf8,#fff7e9);border-color:#d6b66f}.external-theme .series-overview{border-color:#d4b56e;box-shadow:0 6rpx 0 #eadbbd}.external-theme .series-overview:before{background:#fbf1df;color:#bd855f}.external-theme .directory-cover{border-color:#d1ad61;box-shadow:5rpx 7rpx 0 #ead9b4}.external-theme .directory-heading-mark{color:#713b24}.external-theme .directory-heading-mark:before{background:#f6cf79}.external-theme .chapter-row{border-color:#d5b56e;box-shadow:0 5rpx 0 #eddfc2}.external-theme .chapter-number{color:#713b24}.external-theme .chapter-title{font-size:24rpx}.external-theme .chapter-arrow{border-color:#8c4f31;background:#c3cf78;color:#713b24}.external-theme .chapter-reading-meta text{background:#f7ecdc}.external-theme .translation-toggle{background:#eef1d1;color:#7f512f}.external-theme .reading-progress-fill{background:#b7c86c}.external-theme .external-translation{border-top-color:#e9ddca;color:#9a8172}.external-theme .chapter-navigation{border-top-color:#eadcc6}.external-theme .chapter-navigation .primary-button{background:#c1cc72;color:#713b24;box-shadow:0 6rpx 16rpx #a3a95d35}.external-theme .chapter-navigation .secondary-button{border-color:#d0b16d;color:#713b24;background:#fffaf1}.external-theme .chapter-navigation button[disabled]{opacity:.4}.external-theme .article-page{background:#fff}.external-theme .article-page .large-title{color:#713b24}.external-theme .article-page .paragraph,.external-theme .article-page .sentence{color:#713b24}.external-theme .article-page .translation-line{background:#fbf6ed;color:#9a8172}.external-theme .article-page .reading-completion{border:2rpx solid #dfc88f;box-shadow:0 6rpx 0 #f1e7d0}.external-theme .article-page .primary-button{background:#c1cc72;color:#713b24;box-shadow:0 6rpx 16rpx #a3a95d35}.external-theme .article-page .primary-button.reading-done{background:#9bc5a4}
@media (max-width: 360px){.hero-title{font-size:39rpx}.module-desc{font-size:17rpx}.article-art{width:136rpx;height:136rpx}}
.word-empty{display:flex;flex-direction:column;gap:12rpx;padding:30rpx}.word-empty .inline-link{margin-top:8rpx}.home-page .recent-empty{min-height:0;margin:0 30rpx 16rpx;padding:26rpx;align-items:flex-start;text-align:left;box-shadow:0 6rpx 20rpx #263a5d08}
.home-page{padding-left:0;padding-right:0}.home-page .section-head{padding-left:30rpx;padding-right:30rpx}.vocab-page .section-head{padding-left:0;padding-right:0}
.learned-tag{background:#e5f4ec;color:#398466}
.letter-slot.answer-correct{color:#238564;border-color:#51bd92;background:#e7f7ee;border-radius:10rpx 10rpx 0 0}.letter-slot.answer-wrong{color:#b93f45;border-color:#e16d74;background:#fff0ef;border-radius:10rpx 10rpx 0 0}.word-token.chosen.answer-correct{color:#238564;background:#dff3e8;box-shadow:inset 0 0 0 2rpx #72cba6}.word-token.chosen.answer-wrong{color:#b93f45;background:#ffeded;box-shadow:inset 0 0 0 2rpx #e99599}.explanation.feedback-wrong{background:#fff0ef}.explanation.feedback-wrong .explanation-title{color:#b84b51}.puzzle-hint{display:block;margin:-12rpx 0 22rpx;text-align:right}
.today-word-card{display:block;padding:30rpx;background:linear-gradient(135deg,#e4f1ff,#edf8f4 85%);border:2rpx solid #d4e7f6;box-shadow:0 10rpx 26rpx #417dac12}
.today-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16rpx}.today-card-top>view{display:flex;flex-direction:column;gap:7rpx}.today-label{font-size:17rpx;font-weight:750;letter-spacing:2rpx;color:#6c94bb}.today-title{font-size:37rpx;font-weight:780;color:#304c70}.today-date{padding:9rpx 17rpx;border-radius:19rpx;background:#ffffffbd;color:#64809f;font-size:20rpx;white-space:nowrap}.today-description{display:block;margin:16rpx 0 30rpx;color:#738ba3;font-size:22rpx}.today-progress-row{display:flex;justify-content:space-between;gap:12rpx;margin-bottom:13rpx;font-size:19rpx;color:#66819f}.today-progress-row text:first-child{font-weight:700;color:#3c658e}.today-word-card .progress-track{height:13rpx;background:#d3e3ed}.today-word-card .progress-fill{background:#65bd9b}.today-preview{display:flex;flex-wrap:wrap;gap:10rpx;margin:25rpx 0 30rpx}.today-chip{padding:9rpx 15rpx;border-radius:17rpx;background:#ffffffc9;color:#56708d;font-size:19rpx}.today-chip-done{background:#dcf4e9;color:#3f9373}.today-word-card .primary-button{height:88rpx;line-height:88rpx;font-size:26rpx}
.favorite-entry{display:flex;align-items:center;gap:20rpx;padding:23rpx 25rpx;border:2rpx solid #e8e2f7;background:#fff}.favorite-entry-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:7rpx}.shortcut-symbol{width:70rpx;height:70rpx;border-radius:22rpx;display:flex;align-items:center;justify-content:center;font-size:34rpx}.shortcut-star{background:#fff1d7;color:#d49d37}.shortcut-title{font-size:26rpx;font-weight:700;color:#394e6c}.shortcut-meta{font-size:19rpx;color:#8d9aac}.shortcut-arrow{font-size:38rpx;color:#a5afbf}.row-favorite{margin-left:auto;color:#d7a245;font-size:28rpx}
.word-hero-top{display:flex;align-items:center;justify-content:space-between;gap:18rpx}.favorite-toggle{width:68rpx;height:68rpx;flex:none;display:flex;align-items:center;justify-content:center;border-radius:22rpx;background:#ffffffb8;color:#9ca9ba;font-size:47rpx;line-height:1}.favorite-toggle.active{background:#fff0cb;color:#d49d37}
.word-source{display:flex;align-items:center;flex-wrap:wrap;gap:12rpx}.word-source .eyebrow{letter-spacing:1rpx}.word-source-progress{padding:6rpx 14rpx;border-radius:17rpx;background:#fff;color:#3978ef;font-size:22rpx;font-weight:800;font-variant-numeric:tabular-nums}.prior-learned-tag{background:#fff3de;color:#9a7736}
.row-learned{margin-left:auto;padding:5rpx 11rpx;border-radius:13rpx;background:#e5f4ec;color:#398466;font-size:17rpx;white-space:nowrap}
</style>
