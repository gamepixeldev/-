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
  ]},
  { id:'paper-boat', title:'The Paper Boat', translation:'纸船的旅行', author:'Read English 原创故事', level:'初级', icon:'⌁', theme:'theme-blue', description:'雨后的水沟里，一只纸船开始了意想不到的旅行。', chapters:[
    {title:'After the Rain',minutes:4,paragraphs:[['After the rain, Nora folded a small boat from a page in her notebook.','She placed it in the stream beside the road.','The paper boat moved slowly under the bridge.'],['Nora ran along the path to follow it.','At the next turn, the stream became wider.','Her little boat sailed toward the park.']],translations:['雨停之后，Nora 用笔记本上的一页纸折成了一只小船。她把船放进路边的小溪里。纸船慢慢地从桥下漂过。','Nora 沿着小路跑着追它。到了下一个拐弯处，溪水变宽了。她的小船正朝公园漂去。']},
    {title:'A Message on the Boat',minutes:4,paragraphs:[['A boy in the park saw the boat near the bank.','He picked it up and found a note inside.','It said, “Have a wonderful day!”'],['The boy smiled and wrote a new message.','Then he set the boat back on the water.','It carried two kind wishes downstream.']],translations:['公园里的一个男孩看见纸船漂到了岸边。他把船捡起来，发现里面有一张纸条。上面写着：“祝你今天过得愉快！”','男孩笑了笑，又写下一条新的祝福。随后，他把纸船放回水面。它载着两份善意，继续顺流而下。']}
  ]},
  { id:'garden-next-door', title:'The Garden Next Door', translation:'隔壁的花园', author:'Read English 原创故事', level:'进阶', icon:'✿', theme:'theme-gold', description:'新搬来的邻居不爱说话，院子里的花却让两家人慢慢熟悉起来。', chapters:[
    {title:'The Quiet Neighbor',minutes:5,paragraphs:[['A new family moved into the house next door.','Their garden was full of weeds, and the gate stayed closed.','Mia waved whenever she saw the quiet old man.'],['One morning, she noticed a row of tiny green leaves by the fence.','Someone had planted flowers there.','Mia wondered who they were for.']],translations:['一个新家庭搬进了隔壁的房子。他们的花园里长满了杂草，大门也一直关着。每次看到那位安静的老人，Mia 都会挥手打招呼。','一天早晨，她注意到篱笆旁长出了一排嫩绿的小叶子。有人在那里种了花。Mia 猜想着那些花是为谁种的。']},
    {title:'Flowers for Everyone',minutes:5,paragraphs:[['Weeks later, bright flowers opened along the fence.','The old man left a small basket of seeds by Mia’s door.','A note said, “There are enough for both gardens.”'],['Mia planted the seeds with her brother.','Soon, neighbors came outside to help.','The fence no longer felt like a wall.']],translations:['几周后，篱笆边开出了鲜艳的花。老人把一小篮种子放在 Mia 家门口。纸条上写着：“这些种子够两个花园一起种。”','Mia 和弟弟一起种下了种子。很快，邻居们也都出来帮忙。那道篱笆不再像一堵隔开的墙。']}
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
 {word:'seed',ipa:'/siːd/',pos:'n.',meaning:'种子',frequency:'常用词',note:'可数名词；plant a seed 表示“播种”。',forms:'复数 seeds',memory:'A seed can grow into a plant. 种子可以长成植物。',examples:[{en:'The seed needs water and sunlight.',cn:'这颗种子需要水和阳光。'}]},
 {word:'quiet',ipa:'/ˈkwaɪət/',pos:'adj.',meaning:'安静的；平静的',frequency:'常用词',note:'描述声音小、环境安静，也可形容人不爱说话。',forms:'比较级 quieter；最高级 quietest',memory:'quiet afternoon：安静的午后。',examples:[{en:'Emma arrived on a quiet Tuesday.',cn:'艾玛在一个安静的星期二到达。'}]},
 {word:'letter',ipa:'/ˈletər/',pos:'n.',meaning:'信；字母',frequency:'常用词',note:'表示“信”时是可数名词；a letter from someone 表示某人寄来的信。',forms:'复数 letters',memory:'write a letter：写一封信。',examples:[{en:'She found a letter with her name on it.',cn:'她发现了一封写着自己名字的信。'}]},
 {word:'worry',ipa:'/ˈwɜːri/',pos:'n. / v.',meaning:'担心；使担忧',frequency:'常用词',note:'作动词表示担心某事；作名词表示忧虑。feel a sudden worry 表示突然感到担忧。',forms:'worried adj. 担心的；worry about：担心……',memory:'Do not worry. 别担心。',examples:[{en:'Leo felt a sudden worry.',cn:'Leo 忽然感到担忧。'}]},
 {word:'harbor',ipa:'/ˈhɑːrbər/',pos:'n.',meaning:'港口；港湾',frequency:'常用词',note:'美式拼写 harbor；英式常写作 harbour。',forms:'复数 harbors',memory:'a fishing boat in the harbor：港口里的一艘渔船。',examples:[{en:'The lighthouse stood above the harbor.',cn:'灯塔矗立在港口上方。'}]},
 {word:'beneath',ipa:'/bɪˈniːθ/',pos:'prep.',meaning:'在……下面',frequency:'常用词',note:'表示位置低于某物，语气比 under 稍正式。',forms:'beneath the lamp：在灯下面',memory:'The note is beneath the book. 纸条在书下面。',examples:[{en:'A notebook lay beneath the lamp.',cn:'灯下面放着一本笔记本。'}]},
 {word:'storm',ipa:'/stɔːrm/',pos:'n.',meaning:'暴风雨；风暴',frequency:'常用词',note:'可数名词，常与 a、the 连用；a storm rolls in 表示风暴袭来。',forms:'复数 storms',memory:'A storm is stronger than ordinary rain. 风暴比普通降雨更猛烈。',examples:[{en:'A storm rolled in from the sea.',cn:'一场风暴从海上袭来。'}]},
 {word:'safely',ipa:'/ˈseɪfli/',pos:'adv.',meaning:'安全地；平安地',frequency:'常用词',note:'副词，修饰动作，说明事情发生时没有危险。',forms:'safe adj. 安全的；safety n. 安全',memory:'return safely：平安归来。',examples:[{en:'The boat turned safely toward the harbor.',cn:'船安全地转向港口。'}]},
 {word:'notice',ipa:'/ˈnoʊtɪs/',pos:'n.',meaning:'通知；告示',frequency:'常用词',note:'作名词表示通知或告示；作动词表示“注意到”。',forms:'notice board：公告栏；notice that：注意到……',memory:'read a notice：阅读一则通知。',examples:[{en:'A notice appeared on the door.',cn:'门上出现了一张通知。'}]},
 {word:'memory',ipa:'/ˈmeməri/',pos:'n.',meaning:'记忆；回忆',frequency:'常用词',note:'可数时表示一段回忆，不可数时表示记忆力。',forms:'复数 memories',memory:'share a memory：分享一段回忆。',examples:[{en:'The adults shared memories of the bookshop.',cn:'大人们分享了关于书店的回忆。'}]},
 {word:'alive',ipa:'/əˈlaɪv/',pos:'adj.',meaning:'活着的；继续存在的',frequency:'常用词',note:'常放在系动词或名词之后；keep something alive 表示让某事物继续存在。',forms:'keep the shop alive：让书店继续经营下去',memory:'The garden feels alive in spring. 春天的花园充满生机。',examples:[{en:'They helped keep the bookshop alive.',cn:'他们帮助书店继续经营下去。'}]},
 {word:'fold',ipa:'/foʊld/',pos:'v.',meaning:'折叠；对折',frequency:'常用词',note:'fold paper into a boat 表示把纸折成一只船。',forms:'folded; folding',memory:'fold a piece of paper：折一张纸。',examples:[{en:'Nora folded a small boat from a page.',cn:'Nora 用一页纸折了一只小船。'}]},
 {word:'stream',ipa:'/striːm/',pos:'n.',meaning:'小溪；水流',frequency:'常用词',note:'通常指较小的自然水流；也可表示连续不断的一股东西。',forms:'复数 streams',memory:'a stream beside the road：路边的一条小溪。',examples:[{en:'She placed the boat in the stream.',cn:'她把小船放进小溪里。'}]},
 {word:'downstream',ipa:'/ˌdaʊnˈstriːm/',pos:'adv.',meaning:'顺流而下',frequency:'拓展词',note:'表示顺着水流方向移动；反义表达为 upstream（逆流而上）。',forms:'downstream from：在……的下游',memory:'down + stream：沿着溪流向下游。',examples:[{en:'The boat carried two wishes downstream.',cn:'小船载着两份祝福顺流而下。'}]},
 {word:'neighbor',ipa:'/ˈneɪbər/',pos:'n.',meaning:'邻居；邻近的人',frequency:'常用词',note:'美式拼写 neighbor；英式拼写 neighbour。',forms:'复数 neighbors',memory:'next-door neighbor：隔壁邻居。',examples:[{en:'A new neighbor moved into the house next door.',cn:'一位新邻居搬进了隔壁的房子。'}]},
 {word:'fence',ipa:'/fens/',pos:'n.',meaning:'栅栏；篱笆',frequency:'常用词',note:'常指围住花园或院子的栅栏；也可作动词表示“用栅栏围住”。',forms:'a garden fence：花园的篱笆',memory:'Flowers grew along the fence. 花沿着篱笆生长。',examples:[{en:'Tiny leaves appeared by the fence.',cn:'篱笆旁冒出了嫩叶。'}]}
]

const externalChapterLessons = {
  'lighthouse-letter':[
    {words:['quiet','letter'],question:{type:'细节理解',kind:'choice',prompt:'Where did Emma find the letter?',cn:'艾玛在哪里发现了那封信？',options:['In a wooden box','Beside the lighthouse','Under the desk','On the boat'],answer:0,explanation:'第一章写到 Emma 在一个木盒里发现了信。'}},
    {words:['harbor','beneath'],question:{type:'细节理解',kind:'choice',prompt:'What did Emma find beneath the lamp?',cn:'艾玛在灯下面发现了什么？',options:['A notebook','A photograph','A key','A map'],answer:0,explanation:'她在铜灯下面发现了一本笔记本。'}},
    {words:['storm','safely'],question:{type:'推理判断',kind:'choice',prompt:'Why did the fishing boat turn toward the harbor?',cn:'渔船为什么转向港口？',options:['The lighthouse was shining again.','Emma called the harbor.','The storm had disappeared.','The boat had run out of fuel.'],answer:0,explanation:'灯塔重新亮起，为海上的船只指引了安全返航的方向。'}}
  ],
  'last-bookshop':[
    {words:['notice','worry'],question:{type:'细节理解',kind:'choice',prompt:'When would the building close?',cn:'这栋楼什么时候关闭？',options:['At the end of the month','The next morning','At the end of the year','After the reading evening'],answer:0,explanation:'门上的通知写明，这栋楼将在月底关闭。'}},
    {words:['memory'],question:{type:'细节理解',kind:'choice',prompt:'What did the adults do at the reading evening?',cn:'阅读之夜上，大人们做了什么？',options:['Shared memories','Sold their books','Painted the shop','Wrote a notice'],answer:0,explanation:'文章提到孩子们朗读故事，大人们分享回忆。'}},
    {words:['alive'],question:{type:'推理判断',kind:'choice',prompt:'Why did the bookshop stay open for another year?',cn:'书店为什么又能继续营业一年？',options:['The community showed that it cared about the shop.','Mr. Reed bought a new building.','Leo decided to move away.','The landlord wanted to open a café.'],answer:0,explanation:'居民们来参加活动并承诺继续支持书店，让房东看到了大家对书店的重视。'}}
  ],
  'paper-boat':[
    {words:['fold','stream'],question:{type:'细节理解',kind:'choice',prompt:'What did Nora use to make the boat?',cn:'Nora 用什么做纸船？',options:['A page from her notebook','A leaf from a tree','A paper bag','A newspaper from home'],answer:0,explanation:'Nora 用笔记本上的一页纸折成了小船。'}},
    {words:['downstream'],question:{type:'细节理解',kind:'choice',prompt:'What did the boy find inside the boat?',cn:'男孩在纸船里发现了什么？',options:['A note','A coin','A small key','A flower'],answer:0,explanation:'男孩在船里发现了一张写着祝福的纸条。'}}
  ],
  'garden-next-door':[
    {words:['fence','neighbor'],question:{type:'细节理解',kind:'choice',prompt:'What did Mia notice by the fence?',cn:'Mia 在篱笆旁注意到了什么？',options:['A row of tiny green leaves','A new gate','A basket of apples','A little bird'],answer:0,explanation:'她看到篱笆旁长出了一排嫩绿的小叶子。'}},
    {words:['seed','neighbor'],question:{type:'主旨归纳',kind:'choice',prompt:'What changed the relationship between the neighbors?',cn:'什么让邻居之间的关系发生了变化？',options:['Sharing seeds and working in the garden','Building a taller fence','Moving to another town','Buying flowers at a shop'],answer:0,explanation:'分享种子、一起种花让邻居们熟悉起来，篱笆也不再像隔阂。'}}
  ]
}
externalSeries.forEach(series => series.chapters.forEach((chapter,index) => {
  const lesson = externalChapterLessons[series.id][index]
  chapter.words = lesson.words
  chapter.questions = [lesson.question, {type:'主旨归纳',kind:'choice',prompt:'Which title best matches this chapter?',cn:'哪个标题最符合本章内容？',options:[chapter.title,...series.chapters.filter((_,i)=>i!==index).map(item=>item.title),'A Different Story'],answer:0,explanation:'本章围绕“' + chapter.title + '”展开，标题概括了主要内容。'}]
  const firstSentence = chapter.paragraphs[0][0]
  chapter.grammarNotes = [{title:'一般过去时：在故事中叙述往事',summary:'观察本章如何用过去时描述已经发生的动作',explanation:'故事讲述已经发生的经历，叙述主要动作时常使用一般过去时。阅读时可以留意动词形式，并结合上下文判断动作发生的时间。',pattern:'主语 + 动词过去式 + 其他',examples:[{en:firstSentence,cn:chapter.translations[0]}]}]
}))

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

// One rich-text analysis belongs to each reading item, independent of the grammar module.
// The article or chapter can later supply grammarContentSource from the admin/API.
export const articleGrammarContent = {
  umbrella:{type:'richtext',html:`<h3>故事为什么用过去时？</h3><p>这篇故事在讲 Lily 归还雨伞的经历。发现雨伞、走进面包店、把伞交还女孩，都是已经发生的动作，因此叙述时使用一般过去时。</p><p><strong>Lily found a blue umbrella beside the bus stop.</strong><br/>莉莉在公交站旁发现了一把蓝色雨伞。found 是 find 的过去式。</p><p><strong>She carried the umbrella to the small bakery.</strong><br/>她把雨伞带到小面包店。carry 变为过去式时，将 y 改成 i，再加 -ed。</p><p><strong>Lily handed her the umbrella.</strong><br/>莉莉把雨伞递给了她。handed 是规则变化，直接加 -ed。</p><h3>even though 表达什么关系？</h3><p><strong>Lily felt warm, even though the rain was cold.</strong><br/>虽然雨很冷，莉莉心里却感到温暖。</p><p>even though 引出与主句形成反差的事实：外面很冷，帮助别人后 Lily 却感到温暖。它与 although 意思接近，语气更强调。注意英文中一般不再同时使用 but。</p>`},
  seed:{type:'richtext',html:`<h3>用过去时串起故事</h3><p>文章按时间顺序写了 Ben 发现种子、照料种子、看到花开放的过程。讲述这些已经发生的动作时，动词要用过去式。</p><p><strong>One day, he saw a tiny seed in a flowerpot.</strong><br/>一天，他在花盆里看到一颗小种子。saw 是 see 的过去式。</p><p><strong>Ben gave the seed a little water and placed the pot in the sun.</strong><br/>本给种子浇了一点水，又把花盆放到阳光下。gave 是 give 的过去式；placed 则是 place 的规则过去式。</p><p><strong>Days passed, and a small green shoot appeared.</strong><br/>几天过去了，一株绿色的小嫩芽冒了出来。passed 和 appeared 都是规则变化。</p><h3>为什么结尾用了现在时？</h3><p><strong>“Good things grow when we care for them,” she said.</strong><br/>“用心照料，美好的事物就会成长。”奶奶说道。</p><p>she said 仍在叙述过去发生的对话；引号里的 grow 和 care 却用一般现在时，因为奶奶说的是一个普遍适用的道理，不只发生在故事里的某一天。when 在这里表示“当……时”。</p>`}
}

// Word and grammar lessons own their content. An admin/API can replace contentSource
// with { type: 'richtext', html } or { type: 'officialAccount', url, title, summary }.
const escapeContentHTML = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const escapeEnglishHTML = value => escapeContentHTML(value).replace(/([’'])(?=[a-z])/gi, '$1\u2060')

export function getWordContentSource(word) {
  if (word.contentSource) return word.contentSource
  const examples = (word.examples || []).map(example => `<blockquote><strong>${escapeEnglishHTML(example.en)}</strong><br/>${escapeContentHTML(example.cn)}</blockquote>`).join('')
  const forms = word.forms ? `<h3>词形变化</h3><p>${escapeContentHTML(word.forms)}</p>` : ''
  return {type:'richtext',html:`<h3>词义与用法</h3><p>${escapeContentHTML(word.note)}</p>${forms}<h3>例句</h3>${examples}<h3>记忆提示</h3><p>${escapeContentHTML(word.memory)}</p>`}
}

export function getGrammarContentSource(item) {
  if (item.contentSource) return item.contentSource
  const examples = (item.examples || []).map(example => `<p><strong>${escapeEnglishHTML(example.en)}</strong><br/>${escapeContentHTML(example.cn)}</p>`).join('')
  return {type:'richtext',html:`<h3>什么时候这样用？</h3><p>${escapeContentHTML(item.explanation)}</p><h3>结构拆解</h3><p><strong>${escapeContentHTML(item.pattern)}</strong></p><h3>例句观察</h3>${examples}`}
}

export function getArticleGrammarContentSource(article, notes = []) {
  if (article.grammarContentSource) return article.grammarContentSource
  if (articleGrammarContent[article.id]) return articleGrammarContent[article.id]
  const sections = notes.map(note => {
    const examples = (note.examples || []).map(example => `<p><strong>${escapeEnglishHTML(example.en)}</strong><br/>${escapeContentHTML(example.cn)}</p>`).join('')
    return `<h3>${escapeContentHTML(note.title)}</h3><p>${escapeContentHTML(note.explanation)}</p><p><strong>${escapeContentHTML(note.pattern)}</strong></p>${examples}`
  }).join('')
  return {type:'richtext',html:sections || '<p>本篇暂无语法解析。</p>'}
}
