<template>
  <div>

  <input type="file" @change="fileUpload" />
<div class="mavonEditor">
    <no-ssr>
      <mavon-editor :toolbars="markdownOption" :language="'ja'" v-model="value" v-on:imgAdd="$imgAdd"/>
    </no-ssr>
  </div>
    <hr>
    <!--  入力 & 送信  -->
    <div class="input">
      <span>Input Text : </span>
      <input v-model="input" type="text">
      <button v-on:click="submit()">Submit</button>
    </div>
    <!--  DBに保存したデータを取得してきて表示する部分  -->
    <!--  一度データを入れていないと表示しない  -->
    <div class="output" v-if="inputDocRef != ''">
      <span>Output Text : {{ output }}<div v-html="$md.render(output)"></div></span>
      <button v-on:click="get()">Get</button>
    </div>
    <!--  DBに保存したデータを取得してきて表示する部分(全件)  -->
    <div class="outputAll">
      <button v-on:click="getAll()">GetAll</button>
      <p v-for="(output, key) in outputAll" :key="key">{{ output }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.mavonEditor {
  width: 100%;
  height: 100%;
}
</style>

<script>
  // firebase モジュールのインポート
  import firebase from '@/plugins/firebase'
  export default {
    data () {
      return {
        value: "",
        db : null, // created で初期化
        input: '', // テキストを入力した時に v-model でデータを保存
        inputDocRef : '', // 保存したデータのIDを入れる（1件だけ取得する時に使う）
        output : '', // submit した後にDBからデータを取得してきたものを保存
        outputAll : [], // 全件取得した時に全件分のデータを入れる
        markdownOption: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        fullscreen: true,
        readmodel: true,
        htmlcode: true,
        help: true,     
      },
      handbook: "#### Markdown"
      }
    },
    created : function () {
      this.db = firebase.firestore(); // dbインスタンスを初期化
    },
    methods: {
      // DBにデータを送信する
      submit : function () {
        // この先にあるthenでthisの参照が切れるのでselfに退避させておく
        let self = this;
        
        // 先程作った「sample」というコレクションを取得する
        let collection = this.db.collection("sample")
        // 「sample」というコレクションに対して {} で定義した情報を add する
        collection.add({
          text: this.value,
        }).then(function(docRef) {
          // 保存に成功した時
          console.log("Document written with ID: ", docRef.id);
          // 1件だけ取得する処理のためにIDを保存しておく
          self.inputDocRef = docRef.id 
        }).catch(function(error) {
          // 保存に失敗した時
          console.error("Error adding document: ", error);
        });
      },
      // 1件だけ取得する
      get : function () {
        // この先にあるthenでthisの参照が切れるのでselfに退避させておく
        let self = this;
        
        // 直前に保存したデータを1件取得してくる
        let collection = this.db.collection("sample")
        let docRef = collection.doc(this.inputDocRef);
        docRef.get().then(function(doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            self.output = doc.data();
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      },
      fileUpload(event) {
  let file = event.target.files[0];
  const storageRef = firebase.storage().ref("images/" + file.name);
  storageRef.put(file).then(() => {
    console.log('uploaded file')
  });
},
$imgAdd(pos, $file) {
            const storageRef = firebase.storage().ref("images/" + $file.name);
  storageRef.put($file).then(() => {
    console.log('uploaded file')
  });
        },
      // 全件取得する
      getAll : function () {
        // この先にあるthenでthisの参照が切れるのでselfに退避させておく
        let self = this;
        
        // 全件取得する
        let collection = this.db.collection("sample");
        collection.get().then((querySnapshot) => {
          self.outputAll = [];
          querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            self.outputAll.push(doc.data())
          });
        });
      },
    }
  }
</script>