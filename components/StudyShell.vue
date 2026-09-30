<template>
  <view class="app-shell">
    <view class="status-spacer"></view>
    <view class="topbar" v-if="!immersive">
      <view class="back-hit" v-if="!['home','reading','vocab','grammar','puzzle'].includes(view)" @tap="back"><text class="back-arrow">‹</text></view>
      <view v-else-if="view !== 'home'" class="back-hit back-placeholder"></view>
      <view class="top-title">{{ pageTitle }}</view>
      <view class="top-action" @tap="view === 'home' ? go('recent') : toast(view === 'puzzle' ? '拼句练习说明' : '搜索内容')">{{ view === 'home' ? '最近' : view === 'puzzle' ? 'ⓘ' : '⌕' }}</view>
    </view>
    <view v-else class="practice-head">
      <view class="back-hit" @tap="back"><text class="back-arrow">‹</text></view>
      <text class="practice-heading">{{ pageTitle }}</text>
      <text class="step-count">{{ practiceIndex + 1 }}/{{ practiceTotal }}</text>
    </view>
    <scroll-view class="page-scroll" scroll-y :scroll-top="scrollTop" :show-scrollbar="false">
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
        <view class="section-head"><text class="section-title">继续上次阅读</text><text class="inline-link" @tap="go('reading')">全部文章　›</text></view>
        <view class="card recent-card" @tap="openArticle(0)"><view class="art-thumb art-blue"><text>☂</text></view><view class="recent-copy"><text class="card-title">The Blue Umbrella</text><text class="card-sub">蓝色雨伞 · 一段关于善意的故事</text><view class="tag-row"><text class="tag">初级</text><text class="tag">6 分钟</text></view></view><text class="chevron">›</text></view>
        <view class="section-head"><text class="section-title">最近学习</text><text class="section-note">随时回到学过的内容</text></view>
        <view class="card recent-line" @tap="openWord(0)"><view class="mini-icon mint">Aa</view><view class="recent-copy"><text class="card-title">kindness</text><text class="card-sub">n. 善意；友好</text></view><text class="chevron">›</text></view>
      </view>

      <view v-else-if="view === 'reading'" class="page reading-page">
        <view class="tabs"><view class="design-tab" :class="{on: readingShelf === 'easy'}" @tap="readingShelf='easy'">轻松阅读</view><view class="design-tab" :class="{on: readingShelf === 'mag'}" @tap="readingShelf='mag'">外刊</view></view>
        <view v-if="readingShelf === 'easy'">
          <view class="filters"><text v-for="f in ['全部','初级','高级']" :key="f" class="filter" :class="{on: readingFilter === f}" @tap="readingFilter=f">{{ f }}</text></view>
          <view class="article-list"><view v-for="article in filteredArticles" :key="article.id" class="article" @tap="openArticle(articles.indexOf(article))"><view class="art" :class="article.theme"><text>{{ article.icon }}</text></view><view class="article-info"><text class="design-article-title">{{ article.translation }}</text><text class="design-article-desc">{{ article.title }}</text><view class="tags"><text class="tag">原创故事</text><text class="tag">{{ article.level }}</text><text class="tag">{{ storyWordCounts[articles.indexOf(article)] }} 词</text></view></view><text class="arr">›</text></view></view>
        </view>
        <view v-else class="shelf"><view v-for="mag in magazines" :key="mag.name" class="mag" @tap="toast('外刊内容将逐步上架')"><view class="mag-cover" :class="mag.tone"><text>{{ mag.icon }}</text></view><text class="mag-name">{{ mag.name }}</text><text class="mag-note">{{ mag.note }}</text></view></view>
      </view>

      <view v-else-if="view === 'article'" class="page article-page">
        <view class="article-heading"><text class="eyebrow">{{ currentArticle.level }}　·　{{ currentArticle.minutes }} MIN READ</text><text class="large-title">{{ currentArticle.title }}</text><text class="article-translation">{{ currentArticle.translation }}</text><view class="tag-row"><text class="tag">{{ currentArticle.words.length }} 个重点词</text><text class="tag">{{ currentArticle.grammar.length }} 个语法点</text></view></view>
        <view class="story-banner" :class="currentArticle.theme"><text class="story-emoji">{{ currentArticle.icon }}</text><text class="story-banner-title">{{ currentArticle.title }}</text><text class="story-banner-caption">A short story for thoughtful reading</text></view>
        <view class="reading-text"><view v-for="(paragraph, p) in currentArticle.paragraphs" :key="p" class="paragraph"><text v-for="(sentence, s) in paragraph" :key="s" class="sentence" @tap="selectedSentence = sentence; toast('已选中句子，可在下方查看中文辅助')">{{ formatEnglish(sentence) }}{{ s < paragraph.length - 1 ? '\u00a0' : '' }}</text><text class="translation-line">{{ currentArticle.translations[p] }}</text></view></view>
        <view class="section-head"><text class="section-title">文章学习</text><text class="section-note">按需选择，不限制顺序</text></view>
        <view class="learning-links"><view class="learning-link" @tap="go('wordlist')"><view class="mini-icon gold">Aa</view><view><text class="card-title">重点词汇</text><text class="card-sub">{{ currentArticle.words.length }} 个单词与固定搭配</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="go('gramlist')"><view class="mini-icon lilac">文</view><view><text class="card-title">语法拆解</text><text class="card-sub">{{ currentArticle.grammar.length }} 个实用语法点</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="startQuestions"><view class="mini-icon blue">✓</view><view><text class="card-title">阅读理解</text><text class="card-sub">{{ currentArticle.questions.length }} 道理解练习</text></view><text class="chevron">›</text></view><view class="learning-link" @tap="go('puzzle')"><view class="mini-icon mint">拼</view><view><text class="card-title">句子拼图</text><text class="card-sub">用文章原句练习语序</text></view><text class="chevron">›</text></view></view>
        <view class="bottom-spacer"></view>
      </view>

      <view v-else-if="view === 'questions'" class="page question-page">
        <view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: ((questionIndex + 1) / currentArticle.questions.length * 100) + '%'}"></view></view></view>
        <text class="question-type">{{ currentQuestion.type }}</text><text class="question-title">{{ currentQuestion.prompt }}</text><text class="question-cn">{{ currentQuestion.cn }}</text>
        <view v-if="currentQuestion.kind === 'choice'" class="option-list"><view v-for="(option, i) in currentQuestion.options" :key="i" class="option-card" :class="optionState(i)" @tap="chooseOption(i)"><text class="option-letter">{{ String.fromCharCode(65 + i) }}</text><text>{{ option }}</text><text v-if="answered && i === currentQuestion.answer" class="option-check">✓</text></view></view>
        <view v-else class="fill-wrap"><input v-model="fillAnswer" class="fill-input" placeholder="输入你的答案" /></view>
        <view v-if="answered" class="explanation"><text class="explanation-title">{{ isCorrect ? '回答正确' : '看看解析' }}</text><text class="explanation-text">{{ currentQuestion.explanation }}</text></view>
        <view class="bottom-action"><button class="primary-button" @tap="questionAction">{{ answered ? (questionIndex < currentArticle.questions.length - 1 ? '下一题' : '完成练习') : '确认答案' }}</button></view>
      </view>

      <view v-else-if="view === 'vocab'" class="page">
        <view class="vocab-intro"><text class="eyebrow">VOCABULARY</text><text class="large-title">把单词学懂，再记牢</text><text class="muted">释义、词性、例句和拼写练习</text></view>
        <view class="card book-card"><view class="book-row"><view class="book-cover">Aa</view><view class="book-info"><text class="card-title">阅读核心词汇</text><text class="card-sub">来自精选文章　·　{{ allWords.length }} 个词条</text><view class="progress-track"><view class="progress-fill" style="width:38%"></view></view><text class="card-sub">已学习 3 个　　共 {{ allWords.length }} 个</text></view></view><view class="book-actions"><text @tap="go('wordlist')">浏览全部词汇　›</text><text @tap="beginSpelling('vocab')">拼写练习　›</text></view><button class="primary-button" @tap="openWord(0)">开始学习</button></view>
        <view class="section-head"><text class="section-title">最近学习</text><text class="section-note">点单词查看完整详解</text></view>
        <view class="word-list"><view v-for="(word,i) in allWords.slice(0,5)" :key="word.word" class="card word-row" @tap="openWord(i)"><view><text class="word-main">{{ word.word }}</text><text class="word-sub">{{ word.pos }}　{{ word.meaning }}</text></view><text class="chevron">›</text></view></view>
      </view>

      <view v-else-if="view === 'wordlist'" class="page"><view class="intro-block"><text class="eyebrow">WORD LIST</text><text class="large-title">阅读核心词汇</text><text class="muted">文章中的重点单词与表达</text></view><view class="word-list"><view v-for="(word,i) in allWords" :key="word.word" class="card word-row" @tap="openWord(i)"><view><text class="word-main">{{ word.word }}</text><text class="word-sub">{{ word.pos }}　{{ word.meaning }}</text></view><text class="chevron">›</text></view></view><view class="bottom-action"><button class="primary-button" @tap="beginSpelling('wordlist')">开始拼写练习</button></view></view>

      <view v-else-if="view === 'worddetail'" class="page word-detail-page"><view class="word-hero"><text class="eyebrow">WORD {{ wordIndex + 1 }} / {{ allWords.length }}</text><text class="word-display">{{ currentWord.word }}</text><view class="pronounce-row"><text class="pronunciation">{{ currentWord.ipa }}</text><text class="sound-button" @tap="toast('音频播放将在后续版本接入')">▶　听发音</text></view><view class="word-badges"><text class="tag">{{ currentWord.pos }}</text><text class="tag">{{ currentWord.frequency }}</text></view><text class="meaning">{{ currentWord.meaning }}</text></view>
        <view class="card detail-card"><text class="detail-label">词义辨析</text><text class="detail-copy">{{ currentWord.note }}</text><view v-if="currentWord.forms" class="form-line"><text class="detail-label">词形变化</text><text class="detail-copy">{{ currentWord.forms }}</text></view></view>
        <view class="section-head"><text class="section-title">例句</text><text class="section-note">来自阅读内容与生活表达</text></view><view v-for="(example,i) in currentWord.examples" :key="i" class="card example-card"><text class="example-en">{{ formatEnglish(example.en) }}</text><text class="example-cn">{{ example.cn }}</text></view>
        <view class="section-head"><text class="section-title">记忆一下</text></view><view class="card detail-card"><text class="detail-copy">{{ currentWord.memory }}</text></view>
        <view class="bottom-action dual-action"><button class="secondary-button" @tap="beginSpelling('worddetail')">拼写练习</button><button class="primary-button" @tap="nextWordDetail">下一个单词</button></view></view>

      <view v-else-if="view === 'spell'" class="page spell-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: ((spellIndex + 1) / spellWords.length * 100) + '%'}"></view></view></view><view class="spell-prompt"><text class="eyebrow">根据中文释义拼出单词</text><text class="spell-meaning">{{ spellWords[spellIndex].pos }}　{{ spellWords[spellIndex].meaning }}</text><text class="hint-link" @tap="toast('首字母提示：' + spellWords[spellIndex].word[0])">需要提示？</text></view><view class="card spelling-card"><view class="letter-slots"><view v-for="(letter,i) in spellSlots" :key="i" class="letter-slot" @tap="removeLetter(i)">{{ letter || '' }}</view></view><view class="letter-bank"><button v-for="(letter,i) in letterBank" :key="i" class="letter-key" :disabled="usedLetters.includes(i) || answered" @tap="addLetter(i)">{{ letter }}</button></view><view v-if="answered" class="explanation"><text class="explanation-title">{{ isCorrect ? '拼写正确！' : '再看一眼正确拼法' }}</text><text class="explanation-text">{{ spellWords[spellIndex].word }}　{{ spellWords[spellIndex].meaning }}</text></view></view><view class="bottom-action"><button class="primary-button" @tap="spellAction">{{ answered ? (spellIndex < spellWords.length - 1 ? '下一个单词' : '完成练习') : '检查拼写' }}</button></view></view>

      <view v-else-if="view === 'grammar' || view === 'gramlist'" class="page grammar-page">
        <view class="hero-home grammar-home-hero"><view class="eyebrow">GRAMMAR NOTES</view><text class="grammar-hero-title">理解规则，<br/>再把句子说清楚。</text><text class="grammar-hero-sub">选知识点，自由开始学习</text><view class="hero-book grammar-book">文</view></view>
        <view class="filters grammar-filters"><text v-for="f in ['全部','基础','时态','句型']" :key="f" class="filter" :class="{on: grammarFilter === f}" @tap="grammarFilter=f">{{ f }}</text></view>
        <view class="grammarlist"><view v-for="(item,i) in visibleGrammar" :key="item.title" class="gramrow" @tap="openGrammar(i)"><view class="gramicon">{{ ['时','让','时','句'][i % 4] }}</view><view class="gramrow-copy"><text class="gramrow-title">{{ item.title }}</text><text class="gramrow-sub">{{ item.level }}　·　讲解与练习</text></view><text class="arr">›</text></view></view>
      </view>

      <view v-else-if="view === 'gramdetail'" class="page"><view class="grammar-hero"><text class="eyebrow">GRAMMAR NOTE</text><text class="large-title">{{ currentGrammar.title }}</text><text class="muted">{{ currentGrammar.summary }}</text></view><view class="section-head"><text class="section-title">什么时候这样用？</text></view><view class="card detail-card"><text class="detail-copy">{{ currentGrammar.explanation }}</text></view><view class="section-head"><text class="section-title">结构拆解</text></view><view class="card grammar-pattern"><text class="pattern-text">{{ currentGrammar.pattern }}</text></view><view class="section-head"><text class="section-title">例句观察</text></view><view v-for="(ex,i) in currentGrammar.examples" :key="i" class="card example-card"><text class="example-en">{{ formatEnglish(ex.en) }}</text><text class="example-cn">{{ ex.cn }}</text></view><view class="bottom-action"><button class="primary-button" @tap="startGrammarQuiz">做几道练习</button></view></view>

      <view v-else-if="view === 'gramquiz'" class="page question-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{width: (grammarAnswered ? '100%' : '35%')}"></view></view><text class="muted">练习</text></view><text class="question-type">语法小练习</text><text class="question-title">{{ currentGrammar.quiz.prompt }}</text><view class="option-list"><view v-for="(option,i) in currentGrammar.quiz.options" :key="i" class="option-card" :class="optionState(i)" @tap="chooseGrammar(i)"><text class="option-letter">{{ String.fromCharCode(65+i) }}</text><text>{{ option }}</text><text v-if="grammarAnswered && i === currentGrammar.quiz.answer" class="option-check">✓</text></view></view><view v-if="grammarAnswered" class="explanation"><text class="explanation-title">{{ grammarCorrect ? '回答正确' : '看看解析' }}</text><text class="explanation-text">{{ currentGrammar.quiz.explanation }}</text></view><view class="bottom-action"><button class="primary-button" @tap="grammarQuizAction">{{ grammarAnswered ? '返回语法解析' : '确认答案' }}</button></view></view>

      <view v-else-if="view === 'puzzle'" class="page puzzle-page">
        <view class="hero-home puzzle-home-hero"><view class="eyebrow">SENTENCE PUZZLE</view><text class="puzzle-hero-title">读懂中文，<br/>重新排好英文。</text><text class="puzzle-hero-sub">可按文章练习，也可独立拼句</text><view class="hero-book puzzle-book">拼</view></view>
        <view class="section-head"><text class="section-title">选择练习内容</text><text class="section-note">不需要先读文章</text></view>
        <view v-for="(article,i) in articles" :key="article.id" class="card recent puzzle-source" @tap="startPuzzle(i)"><view class="thumb" :class="article.theme">{{ article.icon }}</view><view class="puzzle-source-copy"><text class="card-title">{{ article.title }}</text><text class="card-sub">{{ article.translation }}　·　{{ article.puzzleCount }} 句练习</text></view><text class="arr">›</text></view>
        <view class="section-head"><text class="section-title">独立练习</text><text class="inline-link" @tap="startPuzzle(0)">随机开始　›</text></view><view class="card recent puzzle-source" @tap="startPuzzle(0)"><view class="thumb puzzle-thumb">Aa</view><view class="puzzle-source-copy"><text class="card-title">基础语序练习</text><text class="card-sub">主谓宾 · 时间表达　·　10 句</text></view><text class="arr">›</text></view>
      </view>
      <view v-else-if="view === 'puzzleplay'" class="page puzzleplay-page"><view class="progress-row"><view class="progress-track"><view class="progress-fill" style="width:25%"></view></view><text class="muted">1 / 4</text></view><text class="question-type">句子拼图</text><text class="puzzle-cn">{{ puzzle.cn }}</text><view class="placed-words"><text v-if="!puzzleWords.length" class="muted">点选下方单词，组成正确句子</text><view v-for="(word,i) in puzzleWords" :key="i" class="word-token chosen" @tap="unpickPuzzle(i)">{{ word }}</view></view><view class="word-bank"><view v-for="(word,i) in shuffledPuzzle" :key="i" class="word-token" :class="{used: usedPuzzle.includes(i)}" @tap="pickPuzzle(i)">{{ word }}</view></view><view v-if="puzzleAnswered" class="explanation"><text class="explanation-title">{{ puzzleCorrect ? '语序正确！' : '参考答案' }}</text><text class="explanation-text">{{ puzzle.answer }}</text></view><view class="bottom-action"><button class="primary-button" @tap="puzzleAction">{{ puzzleAnswered ? '继续练习' : '检查答案' }}</button></view></view>

      <view v-else-if="view === 'recent'" class="page"><view class="intro-block"><text class="eyebrow">YOUR LEARNING</text><text class="large-title">最近学习</text><text class="muted">最近查看的词汇，可随时回来复习</text></view><view v-for="(word,i) in allWords.slice(0,5)" :key="word.word" class="card word-row" @tap="openWord(i)"><view><text class="word-main">{{ word.word }}</text><text class="word-sub">{{ word.pos }}　{{ word.meaning }}</text></view><text class="chevron">›</text></view></view>
    </scroll-view>
    <view v-if="!immersive && ['home','reading','vocab','grammar','puzzle'].includes(view)" class="tabbar"><view v-for="tab in tabs" :key="tab.id" class="tab-item" :class="{active: activeTab === tab.id}" @tap="go(tab.id)"><text class="tab-icon">{{ tab.icon }}</text><text>{{ tab.label }}</text></view></view>
  </view>
  <view v-if="toastMessage" class="toast">{{ toastMessage }}</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { articles, words, grammar } from '../pages/index/learning-data.js'

const props = defineProps({ initialView: { type: String, default: 'home' }, initialIndex: { type: Number, default: 0 }, returnView: { type: String, default: 'vocab' } })
const view = ref(props.initialView)
const activeTab = ref(props.initialView)
const viewStack = ref([])
const scrollTop = ref(0)
const readingFilter = ref('全部')
const readingShelf = ref('easy')
const grammarFilter = ref('全部')
const articleIndex = ref(props.initialIndex)
const wordIndex = ref(props.initialIndex)
const grammarIndex = ref(props.initialIndex)
const questionIndex = ref(0)
const selectedOption = ref(-1)
const answered = ref(false)
const isCorrect = ref(false)
const fillAnswer = ref('')
const spellIndex = ref(0)
const spellReturn = ref(props.returnView)
const spellWords = ref(props.initialView === 'spell' && props.returnView === 'worddetail' ? [words[props.initialIndex] || words[0]] : words)
const spellSlots = ref([])
const letterBank = ref([])
const usedLetters = ref([])
const grammarAnswered = ref(false)
const grammarCorrect = ref(false)
const puzzleWords = ref([])
const shuffledPuzzle = ref([])
const usedPuzzle = ref([])
const puzzleAnswered = ref(false)
const puzzleCorrect = ref(false)
const selectedSentence = ref('')
const toastMessage = ref('')
const tabs = [{id:'home',label:'首页',icon:'⌂'},{id:'reading',label:'精读',icon:'▤'},{id:'grammar',label:'语法',icon:'文'},{id:'vocab',label:'单词',icon:'Aa'},{id:'puzzle',label:'拼句',icon:'拼'}]
const allWords = words
const grammarItems = grammar
const storyWordCounts = [148, 126]
const currentArticle = computed(() => articles[articleIndex.value] || articles[0])
const currentWord = computed(() => allWords[wordIndex.value] || allWords[0])
const currentGrammar = computed(() => grammarItems[grammarIndex.value] || grammarItems[0])
const currentQuestion = computed(() => currentArticle.value.questions[questionIndex.value] || currentArticle.value.questions[0])
const filteredArticles = computed(() => readingFilter.value === '全部' ? articles : articles.filter((a,i) => readingFilter.value === '高级' ? i > 0 : i === 0))
const visibleGrammar = computed(() => grammarFilter.value === '全部' ? grammarItems : grammarItems.filter(item => grammarFilter.value === '基础' ? item.level.includes('基础') : grammarFilter.value === '时态' ? item.title.includes('时') || item.title.includes('过去') : item.title.includes('从句')))
const magazines = [{name:'城市周刊',note:'生活 · 每周更新',icon:'📰',tone:''},{name:'自然地理',note:'自然 · 文化',icon:'🏔️',tone:'gold'},{name:'旅行手记',note:'旅行 · 风物',icon:'🗺️',tone:'green'},{name:'世界观察',note:'人文 · 社会',icon:'🌐',tone:'purple'}]
const pageTitle = computed(() => ({home:'读句 English',reading:'精读',article:'文章精读',questions:'阅读理解',vocab:'单词详解',wordlist:'全部词汇',worddetail:'单词详解',spell:'拼写练习',grammar:'语法学习',gramlist:'语法拆解',gramdetail:'语法详解',gramquiz:'语法练习',puzzle:'拼句练习',puzzleplay:'拼句练习',recent:'最近学习'})[view.value] || '读句 English')
const immersive = computed(() => ['spell','questions','gramquiz'].includes(view.value))
const practiceIndex = computed(() => view.value === 'spell' ? spellIndex.value : view.value === 'gramquiz' ? 0 : questionIndex.value)
const practiceTotal = computed(() => view.value === 'spell' ? spellWords.value.length : view.value === 'gramquiz' ? 1 : currentArticle.value.questions.length)
const puzzleItems = [{cn:'她把伞递给了那个淋雨的女孩。',answer:'She handed the umbrella to the girl in the rain.'},{cn:'本每天查看它，并记下发生了什么变化。',answer:'Ben checked it every day and wrote down what changed.'}]
const puzzleIndex = ref(props.initialIndex)
const puzzle = computed(() => puzzleItems[puzzleIndex.value] || puzzleItems[0])

function toast(message) { toastMessage.value = message; setTimeout(() => { if (toastMessage.value === message) toastMessage.value = '' }, 1800) }
function formatEnglish(text) { return text.replace(/([’'])(?=[a-z])/gi, '$1\u2060') }
function go(next) { const routes = {home:'/pages/index/index',reading:'/pages/reading/index',article:'/pages/reading/article',questions:'/pages/reading/questions',vocab:'/pages/vocab/index',wordlist:'/pages/vocab/list',worddetail:'/pages/vocab/detail',spell:'/pages/vocab/spell',grammar:'/pages/grammar/index',gramlist:'/pages/grammar/index',gramdetail:'/pages/grammar/detail',gramquiz:'/pages/grammar/quiz',puzzle:'/pages/puzzle/index',puzzleplay:'/pages/puzzle/play',recent:'/pages/recent/index'}; if (routes[next] && next !== props.initialView) { const item = next === 'article' || next === 'questions' ? articleIndex.value : next === 'worddetail' || next === 'spell' ? wordIndex.value : next === 'gramdetail' || next === 'gramquiz' ? grammarIndex.value : puzzleIndex.value; const extra = next === 'spell' ? '&from=' + spellReturn.value : ''; uni.navigateTo({url: routes[next] + '?item=' + item + extra}); return }; if (next === view.value) return; viewStack.value.push(view.value); view.value = next; if (['home','reading','vocab','grammar','puzzle'].includes(next)) activeTab.value = next; scrollTop.value = 0 }
function back() { if (viewStack.value.length) { view.value = viewStack.value.pop(); if (['home','reading','vocab','grammar','puzzle'].includes(view.value)) activeTab.value = view.value } else if (props.initialView !== 'home') { uni.navigateBack({ fail: () => uni.redirectTo({url:'/pages/index/index'}) }); return } else { view.value = 'home'; activeTab.value = 'home' }; scrollTop.value = 0 }
function openArticle(i) { articleIndex.value = i; questionIndex.value = 0; selectedSentence.value = ''; go('article') }
function openWord(i) { wordIndex.value = i; go('worddetail') }
function openGrammar(i) { grammarIndex.value = i; go('gramdetail') }
function startQuestions() { questionIndex.value = 0; selectedOption.value = -1; answered.value = false; fillAnswer.value = ''; go('questions') }
function chooseOption(i) { if (!answered.value) selectedOption.value = i }
function optionState(i) { if (!answered.value) return selectedOption.value === i ? 'chosen-option' : ''; if (i === currentQuestion.value.answer) return 'correct-option'; if (i === selectedOption.value) return 'wrong-option'; return '' }
function questionAction() { if (!answered.value) { if (selectedOption.value < 0 && !fillAnswer.value.trim()) { toast('先选择或填写答案'); return }; const q = currentQuestion.value; isCorrect.value = q.kind === 'choice' ? selectedOption.value === q.answer : fillAnswer.value.trim().toLowerCase() === q.answer.toLowerCase(); answered.value = true } else if (questionIndex.value < currentArticle.value.questions.length - 1) { questionIndex.value++; selectedOption.value = -1; answered.value = false; fillAnswer.value = '' } else { toast('阅读理解完成'); back() } }
function beginSpelling(from) { spellReturn.value = from; spellWords.value = from === 'worddetail' ? [currentWord.value] : allWords; spellIndex.value = 0; setupSpell(); go('spell') }
function setupSpell() { const answer = spellWords.value[spellIndex.value].word.toLowerCase(); spellSlots.value = Array(answer.length).fill(''); const chars = answer.split(''); letterBank.value = [...chars].sort(() => Math.random() - .5); usedLetters.value = []; answered.value = false; isCorrect.value = false }
function addLetter(i) { if (usedLetters.value.includes(i)) return; const empty = spellSlots.value.indexOf(''); if (empty < 0) return; spellSlots.value[empty] = letterBank.value[i]; usedLetters.value.push(i) }
function removeLetter(i) { if (answered.value || !spellSlots.value[i]) return; const char = spellSlots.value[i]; const bankIndex = letterBank.value.findIndex((c,j) => c === char && usedLetters.value.includes(j)); if (bankIndex >= 0) usedLetters.value = usedLetters.value.filter(j => j !== bankIndex); spellSlots.value[i] = '' }
function spellAction() { if (!answered.value) { if (spellSlots.value.includes('')) { toast('请先填完所有字母'); return }; const typed = spellSlots.value.join(''); isCorrect.value = typed === spellWords.value[spellIndex.value].word.toLowerCase(); answered.value = true } else if (spellIndex.value < spellWords.value.length - 1) { spellIndex.value++; setupSpell() } else { toast('拼写练习完成'); uni.navigateBack({fail:() => uni.redirectTo({url:spellReturn.value === 'worddetail' ? '/pages/vocab/detail?item=' + wordIndex.value : '/pages/vocab/list'})}) } }
function nextWordDetail() { wordIndex.value = (wordIndex.value + 1) % allWords.length }
function chooseGrammar(i) { if (grammarAnswered.value) return; selectedOption.value = i }
function startGrammarQuiz() { selectedOption.value = -1; grammarAnswered.value = false; go('gramquiz') }
function grammarQuizAction() { if (!grammarAnswered.value) { if (selectedOption.value < 0) { toast('先选择一个答案'); return }; grammarCorrect.value = selectedOption.value === currentGrammar.value.quiz.answer; grammarAnswered.value = true } else { back() } }
function pickPuzzle(i) { if (usedPuzzle.value.includes(i) || puzzleAnswered.value) return; puzzleWords.value.push(shuffledPuzzle.value[i]); usedPuzzle.value.push(i) }
function unpickPuzzle(i) { if (puzzleAnswered.value) return; const word = puzzleWords.value[i]; puzzleWords.value.splice(i,1); const bankIndex = usedPuzzle.value.find(j => shuffledPuzzle.value[j] === word); if (bankIndex !== undefined) usedPuzzle.value = usedPuzzle.value.filter(j => j !== bankIndex) }
function startPuzzle(i) { puzzleIndex.value = i % puzzleItems.length; initPuzzle(); go('puzzleplay') }
function puzzleAction() { if (puzzleAnswered.value) { puzzleWords.value = []; usedPuzzle.value = []; puzzleAnswered.value = false; puzzleCorrect.value = false; return }; if (!puzzleWords.value.length) { toast('先点选下方单词'); return }; puzzleCorrect.value = puzzleWords.value.join(' ') === puzzle.value.answer; puzzleAnswered.value = true }
function initPuzzle() { shuffledPuzzle.value = puzzle.value.answer.split(' ').sort(() => Math.random() - .5); puzzleWords.value = []; usedPuzzle.value = []; puzzleAnswered.value = false }
if (props.initialView === 'spell') setupSpell()
else initPuzzle()
</script>

<style>
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
.puzzle-source{display:flex;align-items:center;gap:20rpx;margin:0 30rpx 18rpx;padding:26rpx;border-radius:34rpx}
.puzzle-source-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:8rpx}
.arr{flex:none;margin-left:auto;color:#aab5c4;font-size:34rpx;line-height:1}
.puzzle-thumb{background:#fff0d7;color:#bc8a3e;font-size:31rpx}
.puzzleplay-page{padding-top:32rpx}
@media (max-width: 360px){.hero-title{font-size:39rpx}.module-desc{font-size:17rpx}.article-art{width:136rpx;height:136rpx}}
</style>
