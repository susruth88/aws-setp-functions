This Repo contains a AWS Step functions project for work flow management
AWS Step functions are used to implement the SAGA pattern, where multiple transactions have to happen after one another. Step functions help in better orchestration of each of the steps 

Here we have a food store factory that has following steps:

1) IngredientPreparation
2) CheckIngredients
3) InsufficientIngredients
4) MixingIngredients
5) Shaping
6) QualityCheck

Tech stack used:
1) AWS Step functions
2) Serverless framework ( Infra as code)
3) S3
4) DynamoDB
5) Lambda

How to run:
1) Go to your project directory
2) Setup the AWS Credients in your local machine
3) download the serverless framework
4) Run the command in the terminal:  $ serverless deploy


 
