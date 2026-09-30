export const articles = [
  { id:'umbrella', title:'The Blue Umbrella', translation:'蓝色雨伞', level:'初级', minutes:6, icon:'☂', theme:'theme-blue', paragraphs:[['On a rainy afternoon, Lily found a blue umbrella beside the bus stop.','It was clean, and its handle had a little silver star.','Lily looked around, but nobody was there.'],['She carried the umbrella to the small bakery on the corner.','The baker smiled and said, “A girl left it here this morning.”','Just then, a wet girl ran inside. Lily handed her the umbrella.'],['“Thank you!” the girl said.','Lily felt warm, even though the rain was cold.','A small act of kindness can brighten someone’s day.']], translations:['一个下雨的午后，莉莉在公交站旁发现了一把蓝色雨伞。伞很干净，伞柄上还有一颗小小的银色星星。莉莉四处看了看，但周围没有人。','她把伞带到街角的小面包店。面包师笑着说：“一个女孩今天早上把它落在这里了。”就在这时，一个浑身湿透的女孩跑进店里，莉莉把伞递给了她。','“谢谢你！”女孩说道。虽然雨很冷，莉莉心里却暖暖的。一个小小的善举，也能照亮别人的一天。'], words:['kindness','umbrella','beside','handle','carry','corner','hand','brighten'], grammar:['past','although'], questions:[{type:'细节理解',kind:'choice',prompt:'Where did Lily find the umbrella?',cn:'莉莉在哪里发现了这把雨伞？',options:['At the bakery','Beside the bus stop','In her classroom','On the bus'],answer:1,explanation:'文章第一句说明，Lily found the umbrella beside the bus stop。'}, {type:'词义猜测',kind:'choice',prompt:'What does “handed” mean in the story?',cn:'结合语境，文中的 handed 是什么意思？',options:['写下','递给','购买','修理'],answer:1,explanation:'Lily 把伞交给那个女孩，因此 handed 在这里表示“递给”。'}, {type:'推理判断',kind:'choice',prompt:'How did Lily probably feel at the end?',cn:'莉莉最后可能是什么心情？',options:['Proud and warm','Angry and tired','Afraid of the girl','Sorry about the rain'],answer:0,explanation:'原文说 Lily felt warm，说明帮助别人让她感到温暖、开心。'}, {type:'主旨归纳',kind:'choice',prompt:'What is the best title for the story?',cn:'哪一个标题最适合这篇短文？',options:['A Rainy Bus Ride','A Small Act of Kindness','The Silver Star','A Busy Bakery'],answer:1,explanation:'故事围绕 Lily 归还雨伞、帮助陌生女孩展开，表达善意能带来温暖。'}] },
  { id:'seed', title:'A Seed on the Windowsill', translation:'窗台上的一颗种子', level:'初级', minutes:5, icon:'🌱', theme:'theme-green', paragraphs:[['Every morning, Ben opened the window before school.','One day, he saw a tiny seed in a flowerpot.','He did not know who had put it there.'],['Ben gave the seed a little water and placed the pot in the sun.','Days passed, and a small green shoot appeared.','Ben checked it every day and wrote down what changed.'],['After a few weeks, a yellow flower opened.','Ben smiled and showed it to his grandmother.','“Good things grow when we care for them,” she said.']], translations:['每天早晨，上学前本都会打开窗户。一天，他在花盆里看到一颗小小的种子。他不知道是谁把它放在那里。','本给种子浇了一点水，又把花盆放到阳光下。几天过去了，一株绿色的小嫩芽冒了出来。本每天都去看看，并记下它发生的变化。','几周后，一朵黄色的小花开放了。本笑着把花展示给奶奶看。“用心照料，美好的事物就会成长。”奶奶说道。'], words:['seed','tiny','appear','place','shoot','check','change','care'], grammar:['past','when'], questions:[{type:'细节理解',kind:'choice',prompt:'What did Ben see in the flowerpot?',cn:'本在花盆里看到了什么？',options:['A little bird','A tiny seed','A yellow leaf','A small stone'],answer:1,explanation:'第一段写到 he saw a tiny seed in a flowerpot。'}, {type:'推理判断',kind:'choice',prompt:'Why did Ben write down the changes?',cn:'本为什么把变化记下来？',options:['He wanted to care for and observe the seed.','He had to finish his homework.','His grandmother asked him to sell it.','He wanted to water the window.'],answer:0,explanation:'他每天查看种子的变化并记录，说明他在持续观察、照料它。'}, {type:'主旨归纳',kind:'choice',prompt:'What can we learn from the story?',cn:'我们能从故事中了解到什么？',options:['Plants grow without water.','Care and patience help good things grow.','Windows should stay closed.','Flowers bloom in one day.'],answer:1,explanation:'Ben 持续照顾种子，最后它开出了花，体现了耐心和关爱的重要性。'}] }
]

// Original short fiction for the external-reading shelf. This content is independent
// from the article learning modules and can later be replaced by licensed publications.
export const externalSeries = [
  { id:'lighthouse-letter', title:'The Lighthouse Letter', translation:'灯塔来信', author:'Read English 原创故事', level:'初级', icon:'✉', theme:'theme-blue', description:'一封迟到多年的信，把艾玛带回海边小镇，也揭开了爷爷留下的秘密。', chapters:[
    {title:'A Letter by the Sea', minutes:4, paragraphs:[['Emma arrived in the little town on a quiet Tuesday.','The sea was gray, and the wind carried the smell of rain.','She had come to clean her grandfather’s old house.'],['In a wooden box, she found a letter with her name on it.','The paper was yellow, but the words were clear.','“When you are ready, meet me at the lighthouse,” it said.']], translations:['一个安静的星期二，艾玛来到了这座小镇。海面灰蒙蒙的，风里带着雨水的气息。她这次回来，是为了整理爷爷的旧房子。','她在一个木盒里发现了一封写着自己名字的信。纸已经泛黄，但字迹仍然清晰。“等你准备好了，就到灯塔来见我。”信上这样写着。']},
    {title:'The Keeper’s Room', minutes:5, paragraphs:[['The lighthouse stood on a hill above the harbor.','Emma climbed the narrow steps and pushed open the heavy door.','Inside, dust covered a small desk and a brass lamp.'],['A notebook lay beneath the lamp.','Her grandfather had written down the names of every boat he had guided home.','At the bottom of the last page, Emma saw her own name.']], translations:['灯塔矗立在港口上方的一座山丘上。艾玛爬上狭窄的台阶，推开沉重的门。里面的小桌和铜灯上都落满了灰尘。','灯下压着一本笔记本。爷爷记下了每一艘由他引航回家的船的名字。在最后一页的最下面，艾玛看到了自己的名字。']},
    {title:'A Light at Night', minutes:5, paragraphs:[['That evening, a storm rolled in from the sea.','The lighthouse lamp had not worked for years.','Emma found a box of matches and an old oil can.'],['She cleaned the glass and lit the lamp.','Its warm light moved across the dark water.','Far away, a fishing boat turned safely toward the harbor.']], translations:['那天傍晚，一场风暴从海上袭来。灯塔的灯已经多年没有亮过了。艾玛找到了一盒火柴和一只旧油壶。','她擦净玻璃，点亮了灯。温暖的光划过漆黑的海面。远处，一艘渔船安全地转向港口。']}
  ]},
  { id:'last-bookshop', title:'The Last Bookshop', translation:'最后一家书店', author:'Read English 原创故事', level:'进阶', icon:'▤', theme:'theme-gold', description:'在一条即将改建的老街上，少年 Leo 想办法守住一家快要关门的书店。', chapters:[
    {title:'A Shop on Maple Street', minutes:5, paragraphs:[['Leo passed the old bookshop every day after school.','Its blue door was always open, even on rainy afternoons.','Inside, Mr. Reed knew the name of every book.'],['One Monday, a notice appeared on the door.','The building would close at the end of the month.','Leo read the words twice and felt a sudden worry.']], translations:['Leo 每天放学后都会经过那家老书店。即使在下雨的下午，它的蓝色门也总是开着。店里的 Reed 先生熟悉每一本书。','一个星期一，门上贴出了一张通知。月底这栋楼就要关闭了。Leo 把通知读了两遍，心里忽然担忧起来。']},
    {title:'The Reading Evening', minutes:5, paragraphs:[['Leo told his classmates about the notice.','“Let’s have a reading evening,” said his friend Maya.','They made posters and invited everyone in the neighborhood.'],['On Friday, people filled the small shop.','Children read stories aloud, while adults shared memories.','Mr. Reed watched the room with a quiet smile.']], translations:['Leo 把通知的事告诉了同学们。“我们来办一场阅读之夜吧。”他的朋友 Maya 说。他们制作了海报，邀请附近的居民参加。','星期五那天，小小的书店里挤满了人。孩子们大声朗读故事，大人们分享回忆。Reed 先生看着屋子里的人，露出了安静的笑容。']},
    {title:'A New Beginning', minutes:4, paragraphs:[['The next morning, Leo brought a box to the shop.','It was full of letters from the people who had come.','Many promised to visit and help keep the shop alive.'],['The landlord agreed to give them more time.','The bookshop would stay open for another year.','Leo opened the blue door and welcomed the first reader.']], translations:['第二天早晨，Leo 给书店带来一个盒子。里面装满了来过这里的人写的信。许多人答应会常来，也会帮忙让书店继续经营下去。','房东同意再给他们一些时间。书店将继续营业一年。Leo 打开蓝色的门，迎接第一位读者。']}
  ]}
]

export const words = [
 {word:'kindness',ipa:'/ˈkaɪndnəs/',pos:'n.',meaning:'善意；友好',frequency:'高频词',note:'kindness 指友善、体贴他人的行为或品质。常用 a small act of kindness 表示“一次小小的善举”。',forms:'kind adj. 友善的；kindly adv. 友善地',memory:'kind（友善的）+ -ness（名词后缀）→ kindness（友善；善意）。',examples:[{en:'A small act of kindness can brighten someone’s day.',cn:'一个小小的善举也能照亮别人的一天。'},{en:'Thank you for your kindness.',cn:'谢谢你的好意。'}]},
 {word:'umbrella',ipa:'/ʌmˈbrelə/',pos:'n.',meaning:'雨伞；伞',frequency:'常用词',note:'可数名词，表示遮雨或遮阳用的伞。注意拼写中间有双写的 l。',forms:'复数 umbrellas',memory:'联想：下雨天记得带 umbrella。',examples:[{en:'She opened her umbrella in the rain.',cn:'她在雨中撑开了雨伞。'}]},
 {word:'beside',ipa:'/bɪˈsaɪd/',pos:'prep.',meaning:'在……旁边',frequency:'常用词',note:'表示位置关系，后面接名词或代词。不要与 besides（此外）混淆。',forms:'beside the bus stop 在公交站旁',memory:'side 是“边”，be-side 可联想为“在……边上”。',examples:[{en:'The shop is beside the station.',cn:'商店在车站旁边。'}]},
 {word:'handle',ipa:'/ˈhændl/',pos:'n.',meaning:'把手；柄',frequency:'常用词',note:'在 umbrella handle 中表示伞柄；也可以作动词，表示“处理；应付”。',forms:'handles; handled（动词过去式）',memory:'门把手、杯柄、伞柄都可以叫 handle。',examples:[{en:'The cup has a small handle.',cn:'这个杯子有一个小把手。'}]},
 {word:'carry',ipa:'/ˈkæri/',pos:'v.',meaning:'拿；搬；携带',frequency:'常用词',note:'强调把某物从一处带到另一处。过去式 carried。',forms:'carries; carried; carrying',memory:'carry sth. to somewhere：把某物带到某处。',examples:[{en:'He carried the box to the kitchen.',cn:'他把盒子搬到了厨房。'}]},
 {word:'corner',ipa:'/ˈkɔːrnər/',pos:'n.',meaning:'拐角；角落',frequency:'常用词',note:'on the corner 常表示“在拐角处”；in the corner 表示“在角落里”。',forms:'on the corner of the street 在街道拐角处',memory:'街角的小店：a shop on the corner。',examples:[{en:'There is a bakery on the corner.',cn:'拐角处有一家面包店。'}]},
 {word:'hand',ipa:'/hænd/',pos:'v.',meaning:'递；交给',frequency:'常用词',note:'作动词表示把东西递给某人，常用 hand sth. to sb. 或 hand sb. sth.。',forms:'hands; handed; handing',memory:'hand someone a book：递给某人一本书。',examples:[{en:'She handed the keys to her brother.',cn:'她把钥匙递给了弟弟。'}]},
 {word:'brighten',ipa:'/ˈbraɪtn/',pos:'v.',meaning:'使明亮；使开心',frequency:'常用词',note:'brighten someone’s day 是常见表达，意为“让某人开心起来；使某人一天愉快”。',forms:'bright adj. 明亮的；brightness n. 明亮',memory:'bright（明亮的）+ -en（使……）→ brighten（使明亮）。',examples:[{en:'Your message brightened my day.',cn:'你的消息让我这一天都开心起来。'}]},
 {word:'seed',ipa:'/siːd/',pos:'n.',meaning:'种子',frequency:'常用词',note:'可数名词；plant a seed 表示“播种”。',forms:'复数 seeds',memory:'A seed can grow into a plant. 种子可以长成植物。',examples:[{en:'The seed needs water and sunlight.',cn:'这颗种子需要水和阳光。'}]}
]

export const grammar = [
 {title:'一般过去时：讲述过去发生的事',summary:'发现、寻找与故事叙述',level:'基础语法',explanation:'描述过去某个时间发生并结束的动作，常与 yesterday、one day、last week 等时间表达连用。规则动词通常加 -ed；不规则动词需要单独记忆。',pattern:'主语 + 动词过去式 + 其他',examples:[{en:'Lily found a blue umbrella.',cn:'莉莉发现了一把蓝色雨伞。'},{en:'Ben gave the seed some water.',cn:'本给种子浇了些水。'}],quiz:{prompt:'选择正确的动词形式：Yesterday, Lily ___ the umbrella.',options:['find','finds','found','finding'],answer:2,explanation:'Yesterday 表示过去时间，find 的过去式是不规则变化 found。'}},
 {title:'Although 引导让步状语从句',summary:'表达“虽然……但是……”',level:'进阶语法',explanation:'although 引导让步状语从句，说明某种情况存在，但主句结果与预期不同。although 和 but 通常不在同一个句子中同时使用。',pattern:'Although + 主语 + 谓语，主语 + 谓语',examples:[{en:'Although the rain was cold, Lily felt warm.',cn:'虽然雨很冷，莉莉心里却很温暖。'}],quiz:{prompt:'选择正确的连接词：___ it was raining, they went outside.',options:['Although','Because','So','Or'],answer:0,explanation:'句意是“虽然在下雨，他们还是出去了”，需要 although 表示让步。'}},
 {title:'When 引导时间状语从句',summary:'描述某个时间发生的动作',level:'基础语法',explanation:'when 可以引导时间状语从句，表示“当……时”。讲述过去发生的事时，主句和从句中的动词通常都使用过去时。',pattern:'When + 一般过去时，主语 + 一般过去时',examples:[{en:'When the girl came in, Lily handed her the umbrella.',cn:'女孩进来时，莉莉把雨伞递给了她。'}],quiz:{prompt:'When Ben ___ the flower, he smiled.',options:['see','saw','sees','seeing'],answer:1,explanation:'故事发生在过去，see 的过去式是 saw。'}}
]

// Sentence puzzles are their own learning collection, not derived from article IDs.
export const puzzleSets = [
  {id:'umbrella-reading',sourceArticleId:'umbrella',title:'The Blue Umbrella',subtitle:'精读文章配套 · 重点句语序',icon:'☂',items:[
    {cn:'莉莉把雨伞递给了那个女孩。',answer:'Lily handed her the umbrella.'},
    {cn:'虽然雨很冷，莉莉心里却感到温暖。',answer:'Lily felt warm even though the rain was cold.'},
    {cn:'一个小小的善举也能照亮别人的一天。',answer:'A small act of kindness can brighten someone’s day.'}
  ]},
  {id:'daily-expression',title:'日常表达',subtitle:'生活场景 · 基础语序',icon:'Aa',items:[
    {cn:'我每天早上喝一杯温水。',answer:'I drink a glass of warm water every morning.'},
    {cn:'她通常坐公交车去上班。',answer:'She usually takes the bus to work.'},
    {cn:'我们晚饭后在公园散步。',answer:'We take a walk in the park after dinner.'},
    {cn:'请把你的书放在桌子上。',answer:'Please put your book on the table.'}
  ]},
  {id:'small-moments',title:'生活小片段',subtitle:'短句理解 · 动作顺序',icon:'✦',items:[
    {cn:'雨停以后，孩子们跑到外面去了。',answer:'The children ran outside after the rain stopped.'},
    {cn:'他发现一张纸条夹在书里。',answer:'He found a note between the pages of the book.'},
    {cn:'奶奶每天给窗台上的植物浇水。',answer:'Grandma waters the plants on the windowsill every day.'},
    {cn:'一个小小的帮助也能让人开心。',answer:'A little help can make someone feel happy.'}
  ]}
]

// Article-specific grammar notes intentionally live separately from the global grammar library.
export const articleGrammar = {
  umbrella:[
    {title:'一般过去时：讲述已经发生的事',summary:'found、carried、handed 描述故事中的过去动作',explanation:'故事讲的是已经发生的事情，所以主要动作使用一般过去时。find 的过去式是不规则变化 found；carry 变过去式时先把 y 改成 i 再加 -ed，成为 carried；handed 则直接加 -ed。',pattern:'主语 + 动词过去式 + 其他',examples:[{en:'Lily found a blue umbrella.',cn:'莉莉发现了一把蓝色雨伞。'},{en:'Lily handed her the umbrella.',cn:'莉莉把雨伞递给了她。'}]},
    {title:'even though：让步关系',summary:'连接“虽然下雨很冷”与“莉莉感到温暖”',explanation:'even though 引出一个与主句形成反差的事实。本文中雨很冷，但莉莉帮助别人后心里感到温暖。它和 although 意义相近，语气稍强调。',pattern:'主句 + even though + 主语 + 谓语',examples:[{en:'Lily felt warm, even though the rain was cold.',cn:'虽然雨很冷，莉莉心里却感到温暖。'}]}
  ],
  seed:[
    {title:'一般过去时：按顺序叙述故事',summary:'saw、gave、placed、appeared 描写过去发生的动作',explanation:'故事中的种子、嫩芽和花依次出现，叙述已经完成的动作时使用一般过去时。注意 see 的过去式是 saw，give 的过去式是 gave，都是不规则变化。',pattern:'主语 + 动词过去式 + 其他',examples:[{en:'One day, he saw a tiny seed.',cn:'一天，他看到了一颗小种子。'},{en:'Ben gave the seed a little water.',cn:'本给种子浇了一点水。'}]},
    {title:'when 引导时间状语从句',summary:'交代另一个动作发生的时间',explanation:'when 在句中表示“当……时”。本篇可以用它把照料种子和种子发芽的过程联系起来；叙述过去事件时，主句和从句的动词都要与过去时间保持一致。',pattern:'When + 主语 + 过去式，主语 + 过去式',examples:[{en:'When the shoot appeared, Ben smiled.',cn:'嫩芽出现时，本笑了。'}]}
  ]
}

// Word and grammar lessons own their content. An admin/API can replace contentSource
// with { type: 'richtext', html } or { type: 'officialAccount', url, title, summary }.
const escapeContentHTML = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const escapeEnglishHTML = value => escapeContentHTML(value).replace(/([’'])(?=[a-z])/gi, '$1\u2060')

export function getWordContentSource(word) {
  if (word.contentSource) return word.contentSource
  const examples = (word.examples || []).map(example => `<p><strong>${escapeEnglishHTML(example.en)}</strong><br/>${escapeContentHTML(example.cn)}</p>`).join('')
  const forms = word.forms ? `<h3>词形变化</h3><p>${escapeContentHTML(word.forms)}</p>` : ''
  return {type:'richtext',html:`<h3>词义辨析</h3><p>${escapeContentHTML(word.note)}</p>${forms}<h3>例句</h3>${examples}<h3>记忆一下</h3><p>${escapeContentHTML(word.memory)}</p>`}
}

export function getGrammarContentSource(item) {
  if (item.contentSource) return item.contentSource
  const examples = (item.examples || []).map(example => `<p><strong>${escapeEnglishHTML(example.en)}</strong><br/>${escapeContentHTML(example.cn)}</p>`).join('')
  return {type:'richtext',html:`<h3>什么时候这样用？</h3><p>${escapeContentHTML(item.explanation)}</p><h3>结构拆解</h3><p><strong>${escapeContentHTML(item.pattern)}</strong></p><h3>例句观察</h3>${examples}`}
}
