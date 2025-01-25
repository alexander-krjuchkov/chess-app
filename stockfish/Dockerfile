FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN wget -O /stockfish.tar https://github.com/official-stockfish/Stockfish/releases/download/sf_17/stockfish-ubuntu-x86-64-avx2.tar && \
    tar -xf /stockfish.tar && \
    rm /stockfish.tar && \
    mv /stockfish/stockfish-ubuntu-x86-64-avx2 /usr/local/bin/stockfish && \
    rm -rf /stockfish && \
    chmod +x /usr/local/bin/stockfish

CMD tail -f /dev/null
