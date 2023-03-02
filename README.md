# CubeTax 友だち追加LIFF

#### 1. リリース
```shell
npm run build
aws s3 cp ./dist s3://cubetax-stripe-liff --recursive
```
- build は docker の中でお願いします
- s3 cp は docker container に aws sam が入ってないのでローカルでお願いします

#### 2. ngrok 起動
5003ってのはlocalhostがlistenシているポートです。
dockerならdocker hostのポートということ
>Forwading

にある URL を LIFF エンドポイントURL に設定する。
この例ならこれ
>https://7073-2400-2411-91e4-8700-a1a8-987e-cdcb-6f50.jp.ngrok.io

ngrokを起動し直すとURLも変わるので都度LINE Developer画面のLIFFの設定も更新
```shell
$ pwd
/Users/satokawa/IdeaProjects
$ ./ngrok http --host-header=rewrite 5003

Session Status                online                                                                                                                                                                                   
Account                       xxxxx xxxxx (Plan: Free)                                                                                                                                                              
Version                       3.1.1                                                                                                                                                                                    
Region                        Japan (jp)                                                                                                                                                                               
Latency                       7ms                                                                                                                                                                                      
Web Interface                 http://127.0.0.1:4040                                                                                                                                                                    
Forwarding                    https://7073-2400-2411-91e4-8700-a1a8-987e-cdcb-6f50.jp.ngrok.io -> http://localhost:5001                                                                                                
                                                                                                                                                                                                                       
Connections                   ttl     opn     rt1     rt5     p50     p90                                                                                                                                              
                              0       0       0.00    0.00    0.00    0.00     
```
#### 構成
- 
- 

#### Lambda 関数情報
- 関数名: 
- 関数のARN: 
- 環境変数
  - 
  - 

#### API Gateway 情報
- 名前: 
- URL: 
- {proxy+}して全てのメソッド、パスを Lambda に proxy してます

#### 決済LIFF SAP をホスティングしている S3 情報
- 名前: cubetax-stripe-liff

