シェーダーのデータセット

◎使用手順
●myFBOsへの登録
ファイルの中でsNameShaderに入っている名前で登録されます。
参照方法はmyFBOs.名前です。以下myFBOs[sNameShader]とします。

●myFBOs[sNameShader]の初期化
myFBOs[sNameShader].initialize(gl,width,height)で行います。ここでcontextを取得し、viewportの大きさを決めます。
この初期化は使用するgraphic contextが取得できた時点で行います。

●myFBOs[sNameShader]の起動
myFBOs[sNameShader].activate();
または
myFBOs[sNameShader].activate("C[NTR]D[NTR]S[NTR]");//ダブルクオーテーション内は正規表現
でオフライン描画モードになります。

●myFBOs[sNameShader]の停止
myFBOs[sNameShader].inactivate();
で停止し、通常の描画モードになります。

◎設定
●sModeOfFBOについて
初期設定がデフォルトとなり、.activate()のときに反映されます。
他に.activate("C[NTR]D[NTR]S[NTR]")で、デフォルトとは別のモードを反映できます。
・CN---カラーバッファについては何もしません。全ての色とアルファにマスクが掛けられてしまいます。
・CT---カラーバッファのレンダリングをテクスチャに行います。myFBOs[sNameShader].textureColorBufferで取り出すことができます。
・CR---カラーバッファをrender bufferで扱います。
・DN---デプスバッファについては何もしません。デプステストも行いません。
・DT---デプスバッファのレンダリングをテクスチャーに行います。フォーマットはDEPTH24_STENCIL8です。myFBOs[sNameShader].textureDepthBufferで取り出すことができます。
・DR---デプスバッファのレンダリングをrender bufferで行います。
・SN---ステンシルバッファについては何もしません。ステンシルテストはdisableです。
・ST---ステンシルバッファのレンダリングをテクスチャに行います。フォーマットはDEPTH24_STENCIL8です。myFBOs[sNameShader].textureStencilBufferで取り出すことができます。
・SR---ステンシルバッファのレンダリングをrender bufferで行います。

●colorBufferModeOfFBOについて
カラーバッファのフォーマットを変えます。
現在使えるのは以下です。
・none
・colorBufferModeIsRGBA4444
・colorBufferModeIsRGBA5551
・colorBufferModeIsALPHA
・colorBufferModeIsR8ForStencil
これらはmyFBOsのプロパティーとして登録されています。

●controllBlendColorDepthStencilOfFBOについて
ブレンド、デプス、ステンシル、カラーについてのシェーダーの動作を登録しておきます。
.active()や.active("C[NTR]D[NTR]S[NTR]")の設定後に実行されます。
この部分は目的に合わせて、ShaderとFBO双方に深く関連しており、テストの場合にも変更を頻繁に行いますので、
myShader,myFBOsなどのように独立させてもいいのですが、とりあえず、myFBOs[sNameShader]に取り込まれ、.activate();の最後に実行されています。

