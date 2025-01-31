const normalizeData = (dataArray) => {
  return dataArray.map(item => {
      // UTF-8 변환 수행 (Buffer 데이터 처리)
      let decoded = Buffer.isBuffer(item) ? item.toString('utf-8') : item;

      // NaN과 undefined를 JSON 파싱 전에 null로 변환
      if (typeof decoded === 'string') {
          decoded = decoded.replace(/\bNaN\b/g, "null"); // NaN → null
          decoded = decoded.replace(/\bundefined\b/g, "null"); // undefined → null
      }

      // JSON 파싱 시도
      let parsedData;
      try {
          if (typeof decoded === 'string' && decoded.trim().startsWith('{')) {
              parsedData = JSON.parse(decoded);
          } else {
              parsedData = decoded;
          }
      } catch (error) {
          console.error("JSON 파싱 오류:", error);
          parsedData = decoded; // 오류 발생 시 원본 데이터 유지
      }

      return parsedData;
  });
};

module.exports = { normalizeData };
