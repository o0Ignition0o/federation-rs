use router_bridge::worker::JsWorker;

#[tokio::main]
async fn main() {
    JsWorker::new(include_str!("../js-dist/test.js"));
}