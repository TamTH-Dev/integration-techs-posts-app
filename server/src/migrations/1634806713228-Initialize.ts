import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initialize1634806713228 implements MigrationInterface {
  name = 'Initialize1634806713228'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vote" ("userId" integer NOT NULL, "postId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_16e301aa5efdd994626b2635186" PRIMARY KEY ("userId", "postId"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "points" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_43cc1af57676ac1b7ec774bd10f" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`,
    )
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_43cc1af57676ac1b7ec774bd10f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`,
    )
    await queryRunner.query(`DROP TABLE "post"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "vote"`)
  }
}
