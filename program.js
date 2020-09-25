const fs = require('fs');

//Đọc dữ liệu từ file input.json
var inputFile = fs.readFileSync("input.json", 'utf8');
var inputData = JSON.parse(inputFile);

function roundTo2Decimal(number)
{
    return Math.round(number * 100) / 100.0;
};

Array.prototype.isChildOf = function (arr)
{
    for (const ele of this)
    {
        if (!arr.includes(ele))
        {
            return false;
        }
    }
    return true;
}

Array.prototype.hasIntersection = function (arr)
{
    for (const ele of this)
    {
        if (arr.includes(ele))
        {
            return true;
        }
    }
    return false;
}


//Tính các hàm tuần suất (của các tiêu chí và các nhà cung cấp)
var totalExpert = inputData.totalExpert;
var criteria = inputData.criteria;
var criteriaData = inputData.criteriaData;
var providersData = inputData.providersData;

for (let i = 0; i < criteriaData.length; i++)
{
    criteriaData[i].m = criteriaData[i].score / totalExpert;
    criteriaData[i].m = roundTo2Decimal(criteriaData[i].m);
}

for (let i = 0; i < providersData.length; i++)
{
    providersData[i].m = [];
    for (let j = 0; j < providersData[i].score.length; j++)
    {
        providersData[i].m[j] = providersData[i].score[j] / totalExpert;
        providersData[i].m[j] = roundTo2Decimal(providersData[i].m[j]);
    }
}

//Xây dựng hàm niềm tin và hàm sự thực
for (let i = 0; i < criteriaData.length; i++) 
{
    criteriaData[i].bel = 0;
    for (let j = 0; j < criteriaData.length; j++)
    {
        if (criteriaData[j].criterion.isChildOf(criteriaData[i].criterion))
        {
            criteriaData[i].bel += criteriaData[j].m;
            criteriaData[i].bel = roundTo2Decimal(criteriaData[i].bel);
        }

    }
}

for (let i = 0; i < criteriaData.length; i++) 
{
    criteriaData[i].pl = 0;
    for (let j = 0; j < criteriaData.length; j++)
    {
        if (criteriaData[j].criterion.hasIntersection(criteriaData[i].criterion))
        {
            criteriaData[i].pl += criteriaData[j].m;
            criteriaData[i].pl = roundTo2Decimal(criteriaData[i].pl);
        }
    }
}

for (let i = 0; i < providersData.length; i++)
{
    providersData[i].bel = [];
    for (let k = 0; k < criteria.length; k++)
    {
        providersData[i].bel[k] = 0;
        for (let j = 0; j < providersData.length; j++)
        {
            if (providersData[j].provider.isChildOf(providersData[i].provider))
            {
                providersData[i].bel[k] += providersData[j].m[k];
                providersData[i].bel[k] = roundTo2Decimal(providersData[i].bel[k]);
            }
        }
    }
}

for (let i = 0; i < providersData.length; i++) 
{
    providersData[i].pl = [];
    for (let k = 0; k < criteria.length; k++)
    {
        providersData[i].pl[k] = 0;
        for (let j = 0; j < providersData.length; j++)
        {
            if (providersData[j].provider.hasIntersection(providersData[i].provider))
            {
                providersData[i].pl[k] += providersData[j].m[k];
                providersData[i].pl[k] = roundTo2Decimal(providersData[i].pl[k]);
            }
        }
    }
}

//Tổng hợp kết quả
var p = [];
p[0] = criteriaData[0].bel;
p[1] = criteriaData[1].pl;

for (let i = 0; i < providersData.length; i++)
{
    providersData[i].belA = 0;
    for (let j = 0; j < providersData[i].bel.length; j++)
    {
        providersData[i].belA += p[j] * providersData[i].bel[j];
        providersData[i].belA = roundTo2Decimal(providersData[i].belA);
    }
}

for (let i = 0; i < providersData.length; i++)
{
    providersData[i].plA = 0;
    for (let j = 0; j < providersData[i].pl.length; j++)
    {
        providersData[i].plA += p[j] * providersData[i].pl[j];
        providersData[i].plA = roundTo2Decimal(providersData[i].plA);
    }
}

//In ra kết quả
console.log(providersData)